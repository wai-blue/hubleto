<?php

namespace HubletoApp\Community\Orders;

class Loader extends \HubletoMain\Core\App
{

  public function init(): void
  {
    parent::init();

    $this->main->router->httpGet([
      '/^orders\/?$/' => Controllers\Orders::class,
    ]);
  }

  public function installTables(int $round): void
  {
    if ($round == 1) {
      $mOrder = new \HubletoApp\Community\Orders\Models\Order($this->main);
      $mOrderProduct = new \HubletoApp\Community\Orders\Models\OrderProduct($this->main);
      $mHistory = new \HubletoApp\Community\Orders\Models\History($this->main);

      $mOrder->dropTableIfExists()->install();
      $mOrderProduct->dropTableIfExists()->install();
      $mHistory->dropTableIfExists()->install();
    }
  }

  public function installDefaultPermissions(): void
  {
    $mPermission = new \HubletoApp\Community\Settings\Models\Permission($this->main);
    $permissions = [
      "HubletoApp/Community/Orders/Models/Order:Create",
      "HubletoApp/Community/Orders/Models/Order:Read",
      "HubletoApp/Community/Orders/Models/Order:Update",
      "HubletoApp/Community/Orders/Models/Order:Delete",

      "HubletoApp/Community/Orders/Models/History:Create",
      "HubletoApp/Community/Orders/Models/History:Read",
      "HubletoApp/Community/Orders/Models/History:Update",
      "HubletoApp/Community/Orders/Models/History:Delete",

      "HubletoApp/Community/Orders/Models/OrderProduct:Create",
      "HubletoApp/Community/Orders/Models/OrderProduct:Read",
      "HubletoApp/Community/Orders/Models/OrderProduct:Update",
      "HubletoApp/Community/Orders/Models/OrderProduct:Delete",

      "HubletoApp/Community/Orders/Controllers/Orders",

      "HubletoApp/Community/Orders/Orders",
    ];

    foreach ($permissions as $permission) {
      $mPermission->record->recordCreate([
        "permission" => $permission
      ]);
    }
  }
}