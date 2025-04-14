<?php

namespace HubletoApp\Community\Deals;

class Loader extends \HubletoMain\Core\App
{

  public function init(): void
  {
    parent::init();

    $this->main->router->httpGet([
      '/^deals\/?$/' => Controllers\Deals::class,
      '/^deals\/settings\/?$/' => Controllers\Settings::class,
      '/^deals\/get-calendar-events\/?$/' => Controllers\Api\GetCalendarEvents::class,
      '/^deals\/archive\/?$/' => Controllers\DealsArchive::class,
      '/^deals\/change-pipeline\/?$/' => Controllers\Api\ChangePipeline::class,
      '/^deals\/change-pipeline-step\/?$/' => Controllers\Api\ChangePipelineStep::class,
      '/^settings\/deal-tags\/?$/' => Controllers\Tags::class,
      '/^deals\/boards\/most-valuable-deals\/?$/' => Controllers\Boards\MostValuableDeals::class,
      '/^deals\/boards\/deal-value-by-status\/?$/' => Controllers\Boards\DealValueByStatus::class,
    ]);

    $this->main->addSetting([
      'title' => $this->translate('Deal statuses'),
      'icon' => 'fas fa-arrow-up-short-wide',
      'url' => 'settings/deal-statuses',
    ]);
    $this->main->addSetting([
      'title' => $this->translate('Deal Tags'),
      'icon' => 'fas fa-tags',
      'url' => 'settings/deal-tags',
    ]);

    $calendarManager = $this->main->apps->getAppInstance(\HubletoApp\Community\Calendar::class)->calendarManager;
    $calendarManager->addCalendar(Calendar::class);

    $reportManager = $this->main->apps->getAppInstance(\HubletoApp\Community\Reports::class)->reportManager;
    $reportManager->addReport(Reports\MonthlyRevenue::class);

    $dashboardManager = $this->main->apps->getAppInstance(\HubletoApp\Community\Desktop::class)->dashboardManager;

    if ($this->configAsBool('showMostValuableDealsInDashboard')) {
      $dashboardManager->addBoard(new \HubletoApp\Community\Desktop\Types\Board(
        'Most valuable deals',
        'deals/boards/most-valuable-deals',
      ));
    }

    if ($this->configAsBool('showDealValueByStatusInDashboard')) {
      $dashboardManager->addBoard(new \HubletoApp\Community\Desktop\Types\Board(
        'Deal value by status',
        'deals/boards/deal-value-by-status',
      ));
    }

    $this->main->apps->getAppInstance(\HubletoApp\Community\Help::class)->addContextHelpUrls('/^deals\/?$/', [
      'en' => 'en/apps/community/deals',
    ]);
  }

  public function installTables(int $round): void
  {
    if ($round == 1) {
      $mDeal = new \HubletoApp\Community\Deals\Models\Deal($this->main);
      $mDealHistory = new \HubletoApp\Community\Deals\Models\DealHistory($this->main);
      $mDealTag = new \HubletoApp\Community\Deals\Models\Tag($this->main);
      $mCrossDealTag = new \HubletoApp\Community\Deals\Models\DealTag($this->main);
      $mDealService = new \HubletoApp\Community\Deals\Models\DealService($this->main);
      $mDealActivity = new \HubletoApp\Community\Deals\Models\DealActivity($this->main);
      $mDealDocument = new \HubletoApp\Community\Deals\Models\DealDocument($this->main);

      $mDeal->dropTableIfExists()->install();
      $mDealHistory->dropTableIfExists()->install();
      $mDealTag->dropTableIfExists()->install();
      $mCrossDealTag->dropTableIfExists()->install();
      $mDealService->dropTableIfExists()->install();
      $mDealActivity->dropTableIfExists()->install();
      $mDealDocument->dropTableIfExists()->install();

      $mDealTag->eloquent->create([ 'name' => "Important", 'color' => '#fc2c03' ]);
      $mDealTag->eloquent->create([ 'name' => "ASAP", 'color' => '#62fc03' ]);
      $mDealTag->eloquent->create([ 'name' => "Extenstion", 'color' => '#033dfc' ]);
      $mDealTag->eloquent->create([ 'name' => "New Customer", 'color' => '#fcdb03' ]);
      $mDealTag->eloquent->create([ 'name' => "Existing Customer", 'color' => '#5203fc' ]);
    }
  }

  public function installDefaultPermissions(): void
  {
    $mPermission = new \HubletoApp\Community\Settings\Models\Permission($this->main);
    $permissions = [
      "HubletoApp/Community/Deals/Models/Deal:Create",
      "HubletoApp/Community/Deals/Models/Deal:Read",
      "HubletoApp/Community/Deals/Models/Deal:Update",
      "HubletoApp/Community/Deals/Models/Deal:Delete",

      "HubletoApp/Community/Deals/Models/DealActivity:Create",
      "HubletoApp/Community/Deals/Models/DealActivity:Read",
      "HubletoApp/Community/Deals/Models/DealActivity:Update",
      "HubletoApp/Community/Deals/Models/DealActivity:Delete",

      "HubletoApp/Community/Deals/Models/DealDocument:Create",
      "HubletoApp/Community/Deals/Models/DealDocument:Read",
      "HubletoApp/Community/Deals/Models/DealDocument:Update",
      "HubletoApp/Community/Deals/Models/DealDocument:Delete",

      "HubletoApp/Community/Deals/Models/DealHistory:Create",
      "HubletoApp/Community/Deals/Models/DealHistory:Read",
      "HubletoApp/Community/Deals/Models/DealHistory:Update",
      "HubletoApp/Community/Deals/Models/DealHistory:Delete",

      "HubletoApp/Community/Deals/Models/DealService:Create",
      "HubletoApp/Community/Deals/Models/DealService:Read",
      "HubletoApp/Community/Deals/Models/DealService:Update",
      "HubletoApp/Community/Deals/Models/DealService:Delete",

      "HubletoApp/Community/Deals/Models/DealTag:Create",
      "HubletoApp/Community/Deals/Models/DealTag:Read",
      "HubletoApp/Community/Deals/Models/DealTag:Update",
      "HubletoApp/Community/Deals/Models/DealTag:Delete",

      "HubletoApp/Community/Deals/Controllers/Deals",
      "HubletoApp/Community/Deals/Controllers/DealsArchive",

      "HubletoApp/Community/Deals/Api/ChangePipelineStep",
      "HubletoApp/Community/Deals/Api/GetCalendarEvents",

      "HubletoApp/Community/Deals/Deals",
    ];

    foreach ($permissions as $permission) {
      $mPermission->eloquent->create([
        "permission" => $permission
      ]);
    }
  }
}