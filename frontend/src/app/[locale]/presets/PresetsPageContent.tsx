'use client';

import { useTranslations } from 'next-intl';
import { Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePresetsData } from './_hooks/usePresetsData';
import { PresetCard } from './_components/PresetCard';
import { PresetFormDialog } from './_components/PresetFormDialog';
import { DeletePresetDialog } from './_components/DeletePresetDialog';

export function PresetsPageContent() {
  const t = useTranslations('presets');
  const {
    presets,
    loading,
    isSubmitting,
    selectedPreset,
    formData,
    setFormData,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isSelectorOpen,
    setIsSelectorOpen,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleFavorite,
    handleLoadPreset,
    openEditDialog,
    openDeleteDialog,
    resetForm,
    addTimezone,
    removeTimezone,
    updateTimezoneHours,
    getTimezoneName,
    getTimezoneOffset,
    formatHoursDisplay,
  } = usePresetsData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const closeForm = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t('pageDescription')}
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          {t('newPreset')}
        </Button>
      </div>

      {presets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('emptyTitle')}</h3>
            <p className="text-muted-foreground text-center mb-4">
              {t('emptyDesc')}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('createPreset')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {presets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              getTimezoneName={getTimezoneName}
              formatHoursDisplay={formatHoursDisplay}
              onLoad={handleLoadPreset}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      <PresetFormDialog
        open={isCreateDialogOpen || isEditDialogOpen}
        isEdit={isEditDialogOpen}
        formData={formData}
        isSelectorOpen={isSelectorOpen}
        isSubmitting={isSubmitting}
        onNameChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
        onDescriptionChange={(value) =>
          setFormData((prev) => ({ ...prev, description: value }))
        }
        onSave={isEditDialogOpen ? handleUpdate : handleCreate}
        onCancel={closeForm}
        onAddTimezone={() => setIsSelectorOpen(true)}
        onRemoveTimezone={removeTimezone}
        onUpdateTimezoneHours={updateTimezoneHours}
        onSelectTimezone={addTimezone}
        onCloseSelector={() => setIsSelectorOpen(false)}
        getTimezoneName={getTimezoneName}
        getTimezoneOffset={getTimezoneOffset}
      />

      <DeletePresetDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        presetName={selectedPreset?.name}
        isSubmitting={isSubmitting}
        onDelete={handleDelete}
      />

    </div>
  );
}
