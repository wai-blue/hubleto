<?php

namespace CeremonyCrmApp\Modules\Core\Settings\Models;

class DealStatus extends \CeremonyCrmApp\Core\Model
{
  public string $table = 'deal_statuses';
  public string $eloquentClass = Eloquent\DealStatus::class;
  public ?string $lookupSqlValue = '{%TABLE%}.name';
  public string $translationContext = 'mod.core.settings.models.dealStatus';

  public function columns(array $columns = []): array
  {
    return parent::columns(array_merge($columns, [
      'name' => [
        'type' => 'varchar',
        $this->translate('Name'),
        'required' => true,
      ],
      'order' => [
        'type' => 'int',
        $this->translate('Order'),
        'required' => true,
      ],
      'color' => [
        'type' => 'color',
        $this->translate('Color'),
        'required' => false,
      ],
    ]));
  }

  public function tableDescribe(array $description = []): array
  {
    $description["model"] = $this->fullName;
    $description = parent::tableDescribe($description);
    $description['ui']['title'] = 'Deal Statuses';
    $description['ui']['addButtonText'] = 'Add Deal Status';
    $description['ui']['showHeader'] = true;
    $description['ui']['showFooter'] = false;
    return $description;
  }
}
