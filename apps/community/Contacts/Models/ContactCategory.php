<?php

namespace HubletoApp\Community\Contacts\Models;

use \ADIOS\Core\Db\Column\Varchar;

class ContactCategory extends \HubletoMain\Core\Model
{
  public string $table = 'contact_categories';
  public string $recordManagerClass = RecordManagers\ContactCategory::class;
  public ?string $lookupSqlValue = '{%TABLE%}.name';

  public function describeColumns(): array
  {
    return array_merge(parent::describeColumns(), [
      'name' => (new Varchar($this, $this->translate('Type')))->setRequired(),
    ]);
  }

  public function describeTable(): \ADIOS\Core\Description\Table
  {
    $description = parent::describeTable();

    $description->ui['title'] = $this->translate('Contact Categories');
    $description->ui['addButtonText'] = 'Add Contact Category';
    $description->ui['showHeader'] = true;
    $description->ui['showFulltextSearch'] = true;
    $description->ui['showFooter'] = false;

    return $description;
  }

}
