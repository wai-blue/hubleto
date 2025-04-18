<?php

namespace HubletoApp\Community\Contacts\Models;

use ADIOS\Core\Db\Column\Lookup;

class PersonTag extends \HubletoMain\Core\Models\Model
{
  public string $table = 'cross_person_tags';
  public string $recordManagerClass = RecordManagers\PersonTag::class;

  public array $relations = [
    'TAG' => [ self::BELONGS_TO, Tag::class, 'id_tag', 'id' ],
    'PERSON' => [ self::BELONGS_TO, Person::class, 'id_person', 'id' ],
  ];

  public function describeColumns(): array
  {
    return array_merge(parent::describeColumns(), [
      'id_person' => (new Lookup($this, $this->translate('Person'), Person::class, 'CASCADE'))->setRequired(),
      'id_tag' => (new Lookup($this, $this->translate('Tag'), Tag::class, 'CASCADE'))->setRequired(),
    ]);
  }

  public function describeTable(): \ADIOS\Core\Description\Table
  {
    $description = parent::describeTable();
    $description->ui['title'] = 'Person Categories';
    return $description;
  }

}
