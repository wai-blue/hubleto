<?php

namespace CeremonyCrmApp\Modules\Core\Settings\Controllers;

class Dashboard extends \CeremonyCrmApp\Core\Controller {

  public string $translationContext = 'mod.core.settings.controllers.dashboard';

  public function prepareView(): void
  {
    parent::prepareView();
    $this->setView(null);
  }

}