import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import type { RequestWithUser } from '../../common/types/request-with-user.interface';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { VotePollDto } from './dto/vote-poll.dto';
import { ClaimPollsDto } from './dto/claim-polls.dto';

// Reading and voting are public on purpose: the poll id is the link secret shared
// with participants. Creating works anonymously, and records the owner when a
// valid token is sent. "mine" and "claim" require a signed-in user.
@ApiTags('polls')
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @ApiOperation({ summary: 'Create a meeting poll (anonymous or signed in)' })
  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreatePollDto,
    @Request() req: Partial<RequestWithUser>,
  ) {
    return this.pollsService.create(dto, req.user?.userId);
  }

  // Declared before ':id' so "mine" is not treated as a poll id.
  @ApiOperation({ summary: 'List polls created by the signed-in user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('mine')
  findMine(@Request() req: RequestWithUser) {
    return this.pollsService.findMine(req.user.userId);
  }

  @ApiOperation({ summary: 'Attach anonymously created polls to the signed-in user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('claim')
  claim(@Body() dto: ClaimPollsDto, @Request() req: RequestWithUser) {
    return this.pollsService.claim(req.user.userId, dto);
  }

  @ApiOperation({ summary: 'Get a meeting poll with its votes' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollsService.findOne(id);
  }

  @ApiOperation({ summary: 'Submit (or replace) a vote' })
  @Post(':id/votes')
  vote(@Param('id') id: string, @Body() dto: VotePollDto) {
    return this.pollsService.vote(id, dto);
  }
}
