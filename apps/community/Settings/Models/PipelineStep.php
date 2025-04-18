<?php

namespace HubletoApp\Community\Settings\Models;

use ADIOS\Core\Db\Column\Color;
use ADIOS\Core\Db\Column\Integer;
use ADIOS\Core\Db\Column\Lookup;
use ADIOS\Core\Db\Column\Varchar;

class PipelineStep extends \HubletoMain\Core\Models\Model
{
  public string $table = 'pipeline_steps';
  public string $recordManagerClass = RecordManagers\PipelineStep::class;
  public ?string $lookupSqlValue = '{%TABLE%}.name';

  public array $relations = [
    'PIPELINE' => [ self::BELONGS_TO, Pipeline::class, 'id_pipeline', 'id' ]
  ];

  public function describeColumns(): array
  {
    return array_merge(parent::describeColumns(), [
      'name' => (new Varchar($this, $this->translate('Name')))->setRequired(),
      'order' => (new Integer($this, $this->translate('Order')))->setRequired(),
      'color' => (new Color($this, $this->translate('Color')))->setRequired(),
      'id_pipeline' => (new Lookup($this, $this->translate("Pipeline"), Pipeline::class, 'CASCADE'))->setRequired(),
      'set_result' => (new Integer($this, $this->translate('Set result of a deal to')))->setRequired()
        ->setEnumValues([1 => "Lost", 2 => "Won", 3 => "Pending"])
    ]);
  }

  public function describeTable(): \ADIOS\Core\Description\Table
  {
    $description = parent::describeTable();

    $description->ui['title'] = 'Pipeline Steps';
    $description->ui['addButtonText'] = 'Add Pipeline Step';
    $description->ui['showHeader'] = true;
    $description->ui['showFulltextSearch'] = true;
    $description->ui['showFooter'] = false;

    return $description;
  }
}
