import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

interface Relation {
  type: 'OneToMany' | 'ManyToOne';
  target: string;
  property: string;
}

interface Column {
  name: string;
  type: string;
  constraints: string[];
}

interface Entity {
  name: string;
  tableName: string;
  columns: Column[];
  relations: Relation[];
}

function parseEntityFile(filePath: string): Entity | null {
  const content = readFileSync(filePath, 'utf-8');

  // Extract entity name
  const entityMatch = content.match(/@Entity\(['"](.+?)['"]\)/);
  if (!entityMatch) return null;
  const tableName = entityMatch[1];

  // Extract class name
  const classMatch = content.match(/export class (\w+)/);
  if (!classMatch) return null;
  const className = classMatch[1];

  // Extract columns
  const columns: Column[] = [];
  const columnRegex = /@Column\((.*?)\)[\s\S]*?(\w+):\s*(\w+)/g;
  const primaryRegex = /@PrimaryGeneratedColumn\(['"]uuid['"]\)[\s\S]*?(\w+):/g;

  // Add primary key
  let match: RegExpExecArray | null;
  while ((match = primaryRegex.exec(content)) !== null) {
    columns.push({
      name: match[1] ?? '',
      type: 'uuid',
      constraints: ['PK'],
    });
  }

  // Add regular columns
  while ((match = columnRegex.exec(content)) !== null) {
    const config = match[1] ?? '';
    const columnName = match[2] ?? '';
    const columnType = match[3] ?? '';

    const constraints: string[] = [];
    if (config.includes('unique: true')) constraints.push('UK');
    if (config.includes('nullable: true')) constraints.push('Nullable');
    if (config.includes('default:')) {
      const defaultMatch = config.match(/default:\s*(['"].*?['"]|\w+)/);
      if (defaultMatch && defaultMatch[1])
        constraints.push(`Default: ${defaultMatch[1]}`);
    }

    columns.push({
      name: columnName,
      type: columnType,
      constraints,
    });
  }

  // Extract relations
  const relations: Relation[] = [];
  const oneToManyRegex = /@OneToMany\(\(\) => (\w+),.*?\)[\s\S]*?(\w+):/g;
  const manyToOneRegex = /@ManyToOne\(\(\) => (\w+),.*?\)[\s\S]*?(\w+):/g;

  let relationMatch: RegExpExecArray | null;
  while ((relationMatch = oneToManyRegex.exec(content)) !== null) {
    relations.push({
      type: 'OneToMany',
      target: relationMatch[1] ?? '',
      property: relationMatch[2] ?? '',
    });
  }

  while ((relationMatch = manyToOneRegex.exec(content)) !== null) {
    relations.push({
      type: 'ManyToOne',
      target: relationMatch[1] ?? '',
      property: relationMatch[2] ?? '',
    });
  }

  return {
    name: className,
    tableName,
    columns,
    relations,
  };
}

function generateMermaidERD(entities: Entity[]): string {
  let mermaid = '```mermaid\nerDiagram\n';

  // Generate relationships
  const relationships = new Set<string>();
  entities.forEach((entity) => {
    entity.relations.forEach((relation) => {
      if (relation.type === 'OneToMany') {
        relationships.add(
          `    ${entity.tableName.toUpperCase()} ||--o{ ${relation.target.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase()} : "has many"`,
        );
      }
    });
  });

  relationships.forEach((rel) => (mermaid += rel + '\n'));
  mermaid += '\n';

  // Generate tables
  entities.forEach((entity) => {
    mermaid += `    ${entity.tableName.toUpperCase()} {\n`;
    entity.columns.forEach((col) => {
      const constraints =
        col.constraints.length > 0 ? ` "${col.constraints.join(', ')}"` : '';
      mermaid += `        ${col.type} ${col.name}${constraints}\n`;
    });
    mermaid += '    }\n\n';
  });

  mermaid += '```';
  return mermaid;
}

async function generateERD() {
  const entityFiles = await glob('src/entities/*.entity.ts', {
    cwd: process.cwd(),
  });

  const entities: Entity[] = [];
  for (const file of entityFiles) {
    const entity = parseEntityFile(file);
    if (entity) entities.push(entity);
  }

  const mermaidDiagram = generateMermaidERD(entities);

  const markdown = `# Timezone Harmony - ER Diagram

${mermaidDiagram}

## Auto-generated from TypeORM Entities

This diagram is automatically generated from TypeORM entity files.

**To update:** Run \`npm run generate:erd\`

## View Instructions

### In VS Code:
1. Install "Markdown Preview Mermaid Support" extension
2. Open this file
3. Press \`Cmd+Shift+V\` (Mac) or \`Ctrl+Shift+V\` (Windows)

### Online:
- Visit https://mermaid.live and paste the mermaid code above

Generated at: ${new Date().toISOString()}
`;

  writeFileSync('ER-DIAGRAM.md', markdown);
  console.log('✅ ER diagram generated successfully!');
}

generateERD().catch(console.error);
