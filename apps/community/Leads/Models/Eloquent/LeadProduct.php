<?php

namespace HubletoApp\Community\Leads\Models\Eloquent;

use HubletoApp\Community\Leads\Models\Eloquent\Lead;
use HubletoApp\Community\Products\Models\Eloquent\Product;

use \Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeadProduct extends \HubletoMain\Core\ModelEloquent
{
  public $table = 'lead_products';

  /** @return BelongsTo<Lead, covariant LeadProduct> */
  public function LEAD(): BelongsTo {
    return $this->belongsTo(Lead::class, 'id_lead', 'id');
  }

  /** @return BelongsTo<Product, covariant LeadProduct> */
  public function PRODUCT(): BelongsTo {
    return $this->belongsTo(Product::class, 'id_product', 'id');
  }

}
