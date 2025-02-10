<?php

namespace HubletoApp\Community\Settings\Models;

use \ADIOS\Core\Db\Column\Varchar;

class Currency extends \HubletoMain\Core\Model
{
  public string $table = 'currencies';
  public string $eloquentClass = Eloquent\Currency::class;
  public ?string $lookupSqlValue = 'CONCAT({%TABLE%}.name ," ","(",{%TABLE%}.code,")")';

  public function describeColumns(): array
  {
    return array_merge(parent::describeColumns(), [
      'name' => (new Varchar($this, $this->translate('Currency'))),
      'code' => (new Varchar($this, $this->translate('Code'))),
    ]);
  }

  public function describeTable(): \ADIOS\Core\Description\Table
  {
    $description = parent::describeTable();

    $description->ui['title'] = 'Currencies';
    $description->ui['addButtonText'] = 'Add currency';
    $description->ui['showHeader'] = true;
    $description->ui['showFooter'] = false;

    return $description;
  }

  public function describeForm(): \ADIOS\Core\Description\Form
  {
    $description = parent::describeForm();

    $id = $this->main->urlParamAsInteger('id');

    $description->ui['title'] = ($id == -1 ? "New currency" : "Currency");
    $description->ui['subTitle'] = ($id == -1 ? "Adding" : "Editing");

    return $description;
  }

}
