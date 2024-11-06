<?php

namespace CeremonyCrmApp\Modules\Sales\Sales\Models;

use CeremonyCrmApp\Modules\Core\Services\Models\Service;
use CeremonyCrmApp\Modules\Sales\Sales\Models\Lead;

class LeadService extends \CeremonyCrmApp\Core\Model
{
  public string $table = 'lead_services';
  public string $eloquentClass = Eloquent\LeadService::class;

  public array $relations = [
    'SERVICE' => [ self::BELONGS_TO, Service::class, 'id_service', 'id' ],
    'LEAD' => [ self::BELONGS_TO, Lead::class, 'id_lead', 'id' ],
  ];

  public function columns(array $columns = []): array
  {
    return parent::columns(array_merge($columns, [
      'id_lead' => [
        'type' => 'lookup',
        'title' => 'Lead',
        'model' => 'CeremonyCrmApp/Modules/Sales/Sales/Models/Lead',
        'foreignKeyOnUpdate' => 'CASCADE',
        'foreignKeyOnDelete' => 'CASCADE',
        'required' => true,
      ],
      'id_service' => [
        'type' => 'lookup',
        'title' => 'Service',
        'model' => 'CeremonyCrmApp/Modules/Core/Services/Models/Service',
        'foreignKeyOnUpdate' => 'CASCADE',
        'foreignKeyOnDelete' => 'CASCADE',
        'required' => true,
      ],
      "unit_price" => [
        "type" => "float",
        "title" => "Unit Price",
        "required" => true,
      ],
      "amount" => [
        "type" => "int",
        "title" => "Amount",
        "required" => true,
      ],
      "discount" => [
        "type" => "float",
        "title" => "Dicount (%)",
      ],
      "tax" => [
        "type" => "float",
        "title" => "Tax (%)",
      ],
    ]));
  }
}
