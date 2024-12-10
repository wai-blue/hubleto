<?php

namespace CeremonyCrmApp\Modules\Core\Settings\Models;

class Country extends \CeremonyCrmApp\Core\Model
{
  public string $table = 'countries';
  public string $eloquentClass = Eloquent\Country::class;
  public ?string $lookupSqlValue = '{%TABLE%}.name';
  public string $translationContext = 'mod.core.settings.models.country';

  public function columns(array $columns = []): array
  {
    return parent::columns([
      'name' => [
        'type' => 'varchar',
        $this->translate('Country Name'),
      ],
      'code' => [
        'type' => 'varchar',
        'byte_size' => '5',
        $this->translate('Code'),
      ],
    ]);
  }

  public function tableDescribe(array $description = []): array
  {
    $description["model"] = $this->fullName;
    $description = parent::tableDescribe($description);
    $description['ui']['title'] = 'Countries';
    $description['ui']['addButtonText'] = 'Add Country';
    $description['ui']['showHeader'] = true;
    $description['ui']['showFooter'] = false;
    return $description;
  }

}
