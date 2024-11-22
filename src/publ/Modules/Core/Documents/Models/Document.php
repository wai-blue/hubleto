<?php

namespace CeremonyCrmApp\Modules\Core\Documents\Models;

use CeremonyCrmApp\Modules\Core\Customers\Models\CompanyDocument;

class Document extends \CeremonyCrmApp\Core\Model
{
  public string $table = 'documents';
  public string $eloquentClass = Eloquent\Document::class;
  public ?string $lookupSqlValue = '{%TABLE%}.name';

  public array $relations = [
    'COMPANY_DOCUMENT' => [ self::HAS_ONE, CompanyDocument::class, 'id_document', 'id' ],
    //'LEAD_DOCUMENT' => [ self::HAS_ONE, LeadDocument::class, 'id_document', 'id' ],
    //'DEAL_DOCUMENT' => [ self::HAS_ONE, DealDocument::class, 'id_document', 'id' ],
  ];

  public function columns(array $columns = []): array
  {
    return parent::columns(array_merge($columns, [
      "name" => [
        "title" => "Document name",
        "type" => "varchar",
        "required" => true,
      ],
      "file" => [
        "title" => "File",
        "type" => "image",
        "required" => true,
      ],
    ]));
  }

  public function tableDescribe(array $description = []): array
  {
    $description["model"] = $this->fullName;
    $description = parent::tableDescribe($description);
    $description['ui']['title'] = 'Documents';
    $description['includeRelations'] = [
      'COMPANY_DOCUMENT',
    ];
    $description['ui']['addButtonText'] = 'Add Document';
    $description['ui']['showHeader'] = true;
    return $description;
  }

  public function formDescribe(array $description = []): array
  {
    $description = parent::formDescribe();
    $description['includeRelations'] = ["COMPANY_DOCUMENT"];
    return $description;
  }

  public function onAfterCreate(array $record, $returnValue)
  {
    if (isset($record["creatingForModel"])) {
      if ($record["creatingForModel"] == "Company") {
        $mActvityCompany = new CompanyDocument($this->app);
        $mActvityCompany->eloquent->create([
          "id_document" => $record["id"],
          "id_company" => $record["creatingForId"]
        ]);
      } /* else if ($record["creatingForModel"] == "Lead") {
        $mLeadActivity = new LeadActivity($this->app);
        $mLeadActivity->eloquent->create([
          "id_activity" => $record["id"],
          "id_lead" => $record["creatingForId"]
        ]);
      } else if ($record["creatingForModel"] == "Deal") {
        $mDealActivity = new DealActivity($this->app);
        $mDealActivity->eloquent->create([
          "id_activity" => $record["id"],
          "id_deal" => $record["creatingForId"]
        ]);
      } */
    }
    return $record;
  }
}
