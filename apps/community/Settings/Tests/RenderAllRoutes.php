<?php

namespace HubletoApp\Community\Settings\Tests;

class RenderAllRoutes extends \HubletoMain\Core\AppTest
{

  public function run(): void
  {
    $routes = [
      'settings',
      'settings/users',
      'settings/user-roles',
      'settings/profiles',
      'settings/general',
      'settings/tags',
      'settings/activity-types',
      'settings/contact-types',
      'settings/countries',
      'settings/currencies',
      'settings/pipelines',
      'settings/permissions',
      'settings/invoice-profiles',
      'settings/config',
    ];

    foreach ($routes as $route) {
      $this->cli->cyan("Rendering route '{$route}'.\n");
      $this->main->render($route);
    }
  }

}
