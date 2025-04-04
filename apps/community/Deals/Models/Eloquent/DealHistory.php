<?php

namespace HubletoApp\Community\Deals\Models\Eloquent;

use HubletoApp\Community\Customers\Models\Eloquent\Customer;
use HubletoApp\Community\Contacts\Models\Eloquent\Person;
use HubletoApp\Community\Deals\Models\Eloquent\Deal;
use HubletoApp\Community\Settings\Models\Eloquent\ActivityType;
use HubletoApp\Community\Settings\Models\Eloquent\Currency;
use HubletoApp\Community\Settings\Models\Eloquent\User;
use \Illuminate\Database\Eloquent\Relations\HasMany;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DealHistory extends \HubletoMain\Core\ModelEloquent
{
  public $table = 'deal_histories';

  /** @return BelongsTo<Deal, covariant DealHistory> */
  public function DEAL(): BelongsTo {
    return $this->belongsTo(Deal::class, 'id_deal', 'id');
  }

}
