<?php

namespace HubletoApp\Community\Products;

class Loader extends \HubletoMain\Core\App
{
  public function init(): void
  {
    parent::init();

    $this->main->router->httpGet([
      '/^products\/?$/' => Controllers\Products::class,
      '/^products\/product-groups\/?$/' => Controllers\Groups::class,
      '/^products\/suppliers\/?$/' => Controllers\Suppliers::class,
    ]);

    if (str_starts_with($this->main->requestedUri, 'products')) {
      // $sidebar = $this->main->apps->community('Desktop')->sidebar;
      // $sidebar->addHeading1($this->translate('Products'));
      // $sidebar->addLink('products', $this->translate('Products'), 'fas fa-cart-shopping');
      // $sidebar->addLink('products/product-groups', $this->translate('Product Groups'), 'fas fa-burger');
      // $sidebar->addLink('products/suppliers', $this->translate('Suppliers'), 'fas fa-truck');

      $appMenu = $this->main->apps->community('Desktop')->appMenu;
      $appMenu->addItem('products', $this->translate('Products'), 'fas fa-cart-shopping');
      $appMenu->addItem('products/product-groups', $this->translate('Product Groups'), 'fas fa-burger');
      $appMenu->addItem('products/suppliers', $this->translate('Suppliers'), 'fas fa-truck');

    }
  }

  public function installTables(int $round): void
  {
    if ($round == 1) {
      $mSupplier = new \HubletoApp\Community\Products\Models\Supplier($this->main);
      $mProduct = new \HubletoApp\Community\Products\Models\Product($this->main);
      $mProductGroup = new \HubletoApp\Community\Products\Models\Group($this->main);

      $mSupplier->dropTableIfExists()->install();
      $mProductGroup->dropTableIfExists()->install();
      $mProduct->dropTableIfExists()->install();
    }
  }

  public function installDefaultPermissions(): void
  {
    $mPermission = new \HubletoApp\Community\Settings\Models\Permission($this->main);
    $permissions = [
      "HubletoApp/Community/Products/Models/Product:Create",
      "HubletoApp/Community/Products/Models/Product:Read",
      "HubletoApp/Community/Products/Models/Product:Update",
      "HubletoApp/Community/Products/Models/Product:Delete",

      "HubletoApp/Community/Products/Models/Supplier:Create",
      "HubletoApp/Community/Products/Models/Supplier:Read",
      "HubletoApp/Community/Products/Models/Supplier:Update",
      "HubletoApp/Community/Products/Models/Supplier:Delete",

      "HubletoApp/Community/Products/Models/Group:Create",
      "HubletoApp/Community/Products/Models/Group:Read",
      "HubletoApp/Community/Products/Models/Group:Update",
      "HubletoApp/Community/Products/Models/Group:Delete",

      "HubletoApp/Community/Products/Controllers/Products",
      "HubletoApp/Community/Products/Controllers/Suppliers",
      "HubletoApp/Community/Products/Controllers/Groups",

      "HubletoApp/Community/Products/Products",
      "HubletoApp/Community/Products/Suppliers",
      "HubletoApp/Community/Products/Groups",
    ];

    foreach ($permissions as $permission) {
      $mPermission->record->recordCreate([
        "permission" => $permission
      ]);
    }
  }
}