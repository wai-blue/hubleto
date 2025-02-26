<?php

namespace HubletoMain\Cli\Agent;

class CommandInit extends \HubletoMain\Cli\Agent\Command
{
  public array $initConfig = [];

  public function parseConfigFile(string $configFile): array
  {
    $configStr = (string) file_get_contents($configFile);
    $config = (array) (\Symfony\Component\Yaml\Yaml::parse($configStr) ?? []);
    return $config;
  }

  public function run(): void
  {
    // define('HUBLETO_COMMUNITY_REPO', __DIR__ . '/../../apps/community');

    $rewriteBase = null;
    $accountFolder = null;
    $accountUrl = null;
    $mainFolder = null;
    $mainUrl = null;
    $dbHost = null;
    $dbUser = null;
    $dbPassword = null;
    $dbName = null;
    $dbCodepage = null;
    $accountFullName = null;
    $adminName = null;
    $adminFamilyName = null;
    $adminEmail = null;
    $adminPassword = null;
    $packagesToInstall = null;
    $appsToInstall = null;
    $externalAppsRepositories = [];

    $configFile = (string) ($this->arguments[2] ?? '');

    if (!empty($configFile) && is_file($configFile)) {
      $config = $this->parseConfigFile($configFile);
    } else {
      $config = $this->initConfig;
    }

    if (isset($config['rewriteBase'])) $rewriteBase = $config['rewriteBase'];
    if (isset($config['accountFolder'])) $accountFolder = $config['accountFolder'];
    if (isset($config['accountUrl'])) $accountUrl = $config['accountUrl'];
    if (isset($config['mainFolder'])) $mainFolder = $config['mainFolder'];
    if (isset($config['mainUrl'])) $mainUrl = $config['mainUrl'];
    if (isset($config['dbHost'])) $dbHost = $config['dbHost'];
    if (isset($config['dbUser'])) $dbUser = $config['dbUser'];
    if (isset($config['dbPassword'])) $dbPassword = $config['dbPassword'];
    if (isset($config['dbName'])) $dbName = $config['dbName'];
    if (isset($config['dbCodepage'])) $dbCodepage = $config['dbCodepage'];
    if (isset($config['accountFullName'])) $accountFullName = $config['accountFullName'];
    if (isset($config['adminName'])) $adminName = $config['adminName'];
    if (isset($config['adminFamilyName'])) $adminFamilyName = $config['adminFamilyName'];
    if (isset($config['adminEmail'])) $adminEmail = $config['adminEmail'];
    if (isset($config['adminPassword'])) $adminPassword = $config['adminPassword'];
    if (isset($config['packagesToInstall'])) $packagesToInstall = $config['packagesToInstall'];
    if (isset($config['appsToInstall'])) $appsToInstall = $config['appsToInstall'];
    if (isset($config['externalAppsRepositories'])) $externalAppsRepositories = $config['externalAppsRepositories'];

    $rewriteBases = [];
    $lastRewriteBase = '';

    foreach (array_reverse(explode('/', str_replace('\\', '/', (string) realpath(__DIR__ . '/../../..')))) as $tmpDir) {
      $rewriteBases[] = $lastRewriteBase . '/';
      $lastRewriteBase = '/' . $tmpDir . $lastRewriteBase;
    }

    if ($rewriteBase === null) $rewriteBase = $this->cli->choose($rewriteBases, 'ConfigEnv.rewriteBase', '/');
    if ($accountFolder === null) $accountFolder = realpath(__DIR__ . '/../../..');
    if ($accountUrl === null) $accountUrl = $this->cli->read('ConfigEnv.accountUrl', 'http://localhost/' . trim((string) $rewriteBase, '/'));
    if ($mainFolder === null) $mainFolder = realpath(__DIR__ . '/../../..');
    if ($mainUrl === null) $mainUrl = $accountUrl;
    if ($dbHost === null) $dbHost = $this->cli->read('ConfigEnv.dbHost', 'localhost');
    if ($dbUser === null) $dbUser = $this->cli->read('ConfigEnv.dbUser (user must exist)', 'root');
    if ($dbPassword === null) $dbPassword = $this->cli->read('ConfigEnv.dbPassword');
    if ($dbName === null) $dbName = $this->cli->read('ConfigEnv.dbName (database will be created)', 'my_hubleto');
    if ($dbCodepage === null) $dbCodepage = $this->cli->read('ConfigEnv.dbCodepage', 'utf8mb4');
    if ($accountFullName === null) $accountFullName = $this->cli->read('Account.accountFullName', 'My Company');
    if ($adminName === null) $adminName = $this->cli->read('Account.adminName', 'John');
    if ($adminFamilyName === null) $adminFamilyName = $this->cli->read('Account.adminFamilyName', 'Smith');
    if ($adminEmail === null) $adminEmail = $this->cli->read('Account.adminEmail (will be used also for login)', 'john.smith@example.com');
    if ($adminPassword === null) $adminPassword = $this->cli->read('Account.adminPassword (leave empty to generate random password)');

    $errors = [];
    $errorColumns = [];
    if (!filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) {
      $errorColumns[] = 'adminEmail';
      $errors[] = 'Invalid admin email.';
    }
    if (!filter_var($accountUrl, FILTER_VALIDATE_URL)) {
      $errorColumns[] = 'accountUrl';
      $errors[] = 'Invalid account url.';
    }
    if (!filter_var($mainUrl, FILTER_VALIDATE_URL)) {
      $errorColumns[] = 'mainUrl';
      $errors[] = 'Invalid main url.';
    }

    if (empty($packagesToInstall)) $packagesToInstall = 'core,sales';
    if (empty($adminPassword)) $adminPassword = \ADIOS\Core\Helper::randomPassword();

    $this->cli->green("       ###         \n");
    $this->cli->green("      ###        ##\n");
    $this->cli->green("     #####      ###\n");
    $this->cli->green("    ###  ####  ### \n");
    $this->cli->green("   ###      #####  \n");
    $this->cli->green("   ##        ###   \n");
    $this->cli->green("            ###    \n");
    $this->cli->cyan("\n");
    $this->cli->green("Hubleto, release " . \HubletoMain::RELEASE . "\n");
    $this->cli->cyan("\n");

    if (sizeof($errors) > 0) {
      $this->cli->red("Some fields contain incorrect values: " . join(" ", $errorColumns) . "\n");
      $this->cli->red(join("\n", $errors));
      $this->cli->white("\n");
      throw new \ErrorException("Some fields contain incorrect values: " . join(" ", $errorColumns) . "\n");
    }

    $this->cli->cyan("Initializing with following config:\n");
    $this->cli->cyan('  -> rewriteBase = ' . (string) $rewriteBase . "\n");
    $this->cli->cyan('  -> accountFolder = ' . (string) $accountFolder . "\n");
    $this->cli->cyan('  -> accountUrl = ' . (string) $accountUrl . "\n");
    $this->cli->cyan('  -> dbHost = ' . (string) $dbHost . "\n");
    $this->cli->cyan('  -> dbUser = ' . (string) $dbUser . "\n");
    $this->cli->cyan('  -> dbPassword = ***' . "\n");
    $this->cli->cyan('  -> dbName = ' . (string) $dbName . "\n");
    $this->cli->cyan('  -> dbCodepage = ' . (string) $dbCodepage . "\n");
    $this->cli->cyan('  -> accountFullName = ' . (string) $accountFullName . "\n");
    $this->cli->cyan('  -> adminName = ' . (string) $adminName . "\n");
    $this->cli->cyan('  -> adminFamilyName = ' . (string) $adminFamilyName . "\n");
    $this->cli->cyan('  -> adminEmail = ' . (string) $adminEmail . "\n");
    $this->cli->cyan('  -> adminPassword = ' . (string) $adminPassword . "\n");
    $this->cli->cyan('  -> packagesToInstall = ' . (string) $packagesToInstall . "\n");

    $this->main->setConfig('db_host', $dbHost);
    $this->main->setConfig('db_user', $dbUser);
    $this->main->setConfig('db_password', $dbPassword);
    $this->main->setConfig('db_name', $dbName);

    $this->main->appManager->setCli($this->cli);

    $this->cli->cyan("\n");
    $this->cli->cyan("Hurray. Installing your Hubleto packages: " . join(", ", explode(",", (string) $packagesToInstall)) . "\n");

    // install
    $installer = new \HubletoMain\Installer\Installer(
      $this->main,
      'local-env',
      '', // uid
      (string) $accountFullName,
      (string) $adminName,
      (string) $adminFamilyName,
      (string) $adminEmail,
      (string) $adminPassword,
      (string) $rewriteBase,
      (string) $accountFolder,
      (string) $accountUrl,
      (string) realpath(__DIR__ . '/../../..'), // mainFolder
      (string) $mainUrl, // mainUrl
      (string) $dbHost,
      (string) $dbName,
      (string) $dbUser,
      (string) $dbPassword,
      false, // randomize (deprecated)
    );

    $installer->appsToInstall = [];
    foreach (explode(',', (string) $packagesToInstall) as $package) {
      $package = trim((string) $package);

      /** @var array<string, array<string, mixed>> */
      $appsInPackage = (is_array($installer->packages[$package]) ? $installer->packages[$package] : []);

      $installer->appsToInstall = array_merge(
        $installer->appsToInstall,
        $appsInPackage
      );
    }

    if (is_array($appsToInstall)) {
      foreach ($appsToInstall as $appToInstall => $appConfig) {
        if (!isset($installer->appsToInstall[$appToInstall])) {
          $installer->appsToInstall[$appToInstall] = $appConfig;
        }
      }
    }

    $installer->externalAppsRepositories = $externalAppsRepositories;

    $this->cli->cyan("  -> Creating folders and files.\n");
    $installer->createFoldersAndFiles();

    $this->cli->cyan("  -> Creating database.\n");
    $installer->createDatabase();

    $this->cli->cyan("  -> Installing apps.\n");
    $installer->installApps();

    $this->cli->cyan("  -> Adding default company profile and admin user.\n");
    $installer->addCompanyProfileAndAdminUser();

    $this->cli->cyan("\n");
    $this->cli->cyan("All done! You're a fantastic CRM developer. Now you can:\n");
    $this->cli->cyan("  -> Open " . (string) $accountUrl . " and sign in with '" . (string) $adminEmail . "' and '" . (string) $adminPassword . "'.\n");
    $this->cli->cyan("  -> Note for NGINX users: don't forget to configure your locations in nginx.conf.\n");
    $this->cli->cyan("  -> Check the developer's guide at https://developer.hubleto.com.\n");
    $this->cli->cyan("\n");
  }
}