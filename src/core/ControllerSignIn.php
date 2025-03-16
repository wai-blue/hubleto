<?php

namespace HubletoMain\Core;

class ControllerSignIn extends \ADIOS\Core\Controller {

  public bool $requiresUserAuthentication = false;
  public bool $hideDefaultDesktop = true;
  public string $translationContext = 'ADIOS\\Core\\Loader::Controllers\\SignIn';

  public function prepareView(): void
  {
    parent::prepareView();
    $this->setView('@hubleto/SignIn.twig');
  }

}