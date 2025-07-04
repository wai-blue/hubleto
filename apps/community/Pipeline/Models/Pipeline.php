<?php

namespace HubletoApp\Community\Pipeline\Models;

use ADIOS\Core\Db\Column\Varchar;

class Pipeline extends \HubletoMain\Core\Models\Model
{
  public string $table = 'pipelines';
  public string $recordManagerClass = RecordManagers\Pipeline::class;
  public ?string $lookupSqlValue = '{%TABLE%}.name';

  public array $relations = [
    'STEPS' => [ self::HAS_MANY, PipelineStep::class, 'id_pipeline', 'id' ]
  ];

  public function describeColumns(): array
  {
    return array_merge(parent::describeColumns(), [
      'name' => (new Varchar($this, $this->translate('Name')))->setRequired(),
      'description' => (new Varchar($this, $this->translate('Description'))),
    ]);
  }

  public function describeTable(): \ADIOS\Core\Description\Table
  {
    $description = parent::describeTable();

    // $description->ui['title'] = 'Pipelines';
    $description->ui['addButtonText'] = 'Add Pipeline';
    $description->ui['showHeader'] = true;
    $description->ui['showFulltextSearch'] = true;
    $description->ui['showFooter'] = false;

    return $description;
  }

}
