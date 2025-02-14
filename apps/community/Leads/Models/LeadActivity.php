<?php

namespace HubletoApp\Community\Leads\Models;

use HubletoApp\Community\Customers\Models\Activity;
use HubletoApp\Community\Contacts\Models\Person;
use HubletoApp\Community\Settings\Models\ActivityType;
use HubletoApp\Community\Settings\Models\User;

use \ADIOS\Core\Db\Column\Lookup;
use \ADIOS\Core\Db\Column\Varchar;
use \ADIOS\Core\Db\Column\Date;
use \ADIOS\Core\Db\Column\Time;
use \ADIOS\Core\Db\Column\Boolean;

class LeadActivity extends \HubletoMain\Core\Model
{
  public string $table = 'lead_activities';
  public string $eloquentClass = Eloquent\LeadActivity::class;

  public array $relations = [
    'LEAD' => [ self::BELONGS_TO, Lead::class, 'id_lead', 'id' ],
  ];

  public function describeColumns(): array
  {
    return array_merge(parent::describeColumns(), [
      'id_lead' => (new Lookup($this, $this->translate('Lead'), Lead::class, 'CASCADE'))->setRequired()->setReadonly(),
      'id_person' => (new Lookup($this, $this->translate('Contact person'), Person::class, 'CASCADE')),
      'id_activity_type' => (new Lookup($this, $this->translate('Activity type'), ActivityType::class, 'SET NULL')),
      'subject' => (new Varchar($this, $this->translate('Subject')))->setRequired(),
      'date_start' => (new Date($this, $this->translate('Start date')))->setRequired(),
      'time_start' => (new Time($this, $this->translate('Start time'))),
      'date_end' => (new Date($this, $this->translate('End date'))),
      'time_end' => (new Time($this, $this->translate('End time'))),
      'all_day' => (new Boolean($this, $this->translate('All day'))),
      'completed' => (new Boolean($this, $this->translate('Completed'))),
      'id_user' => (new Lookup($this, $this->translate('Created by'), User::class, 'CASCADE')),
    ]);
  }
}
