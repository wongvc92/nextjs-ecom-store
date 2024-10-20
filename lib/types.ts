export interface Category {
  id: string;
  name: string;
}

export interface Size {
  id: string;
  name: string;
}

export interface Color {
  id: string;
  name: string;
}

export interface INestedVariation {
  id: string | null;
  label: string | null;
  name: string | null;
  priceInCents: number | null; // Convert Decimal to string
  stock: number | null;
  sku: string | null;
}

export interface IVariation {
  id: string | null;
  label: string | null;
  name: string | null;
  priceInCents: number | null; // Convert Decimal to string
  stock: number | null;
  sku: string | null;
  image: string | null;
  nestedVariations: INestedVariation[];
}

export interface ICartWithProduct {
  id: string;
  variationType: string;
  productName: string;
  productId: string;
  category: string;
  weight: string;
  shippingFeeInCents: string;
  variations: IVariation[];
  variationId: string | null;
  variationLabel: string | null;
  variationName: string | null;
  nestedVariationId: string | null;
  nestedVariationLabel: string | null;
  nestedVariationName: string | null;
  productImages: IProductImage[];
  priceInCents: string;
  image: string;
  maxPurchase: string;
  quantity: string; // Adding quantity field to represent the quantity of this item in the cart
}

export interface ICartItem {
  id: string;
  productId: string;
  variations: IVariation[];
  variationId: string | null;
  nestedVariationId: string | null;
  variationType: string;
  quantity: string; // Adding quantity field to represent the quantity of this item in the cart
}

export interface IProductImage {
  id: string;
  url: string;
  productId: string | null;
}

export interface IProduct {
  id: string;
  productImages: IProductImage[];
  variationType: string;
  name: string;
  category: string;
  description: string;
  priceInCents: number;
  lowestPriceInCents: number;
  stock: number;
  minPurchase: number;
  maxPurchase: number;
  weightInGram: number;
  width: number;
  length: number;
  height: number;
  shippingFeeInCents: number;
  variations: IVariation[];
}

export interface ISelectedFavouriteVariations {
  id: string;
  userId: string;
  productId: string;
  variationType: string;
  isVariationIdSelected: boolean | null;
  isNestedVariationIdSelected: boolean | null;
  variationId: string | null;
  variationLabel: string | null;
  variationName: string | null;
  nestedVariationId: string | null;
  nestedVariationLabel: string | null;
  nestedVariationName: string | null;
}

export interface IProductFavourites {
  id: string;
  inStock: boolean;
  productImages: IProductImage[];
  variationType: string;
  name: string;
  category: string;
  description: string;
  priceInCents: string;
  stock: string;
  minPurchase: string;
  maxPurchase: string;
  weightInGram: string;
  shippingFeeInCents: string;
  variations: IVariation[];
  selectedVariationId: string | null;
  selectedVariationLabel: string | null;
  selectedVariationName: string | null;
  selectedNestedVariationId: string | null;
  selectedNestedVariationLabel: string | null;
  selectedNestedVariationName: string | null;
  isVariationIdSelected: boolean;
  isNestedVariationIdSelected: boolean;
  createdAt: string;
}

export interface IShipping {
  address: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  name: string;
  phone: string;
  email: string;
  orderId: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  image: string | null;
  priceInCents: number;
  quantity: number;
  variationId: string | null;
  variationLabel: string | null;
  variationName: string | null;
  nestedVariationId: string | null;
  nestedVariationLabel: string | null;
  nestedVariationName: string | null;
  shippingFeeInCents: number;
  createdAt: string;
  updatedAt: string;
}

export interface IOrder {
  id: string;
  customerId: string;
  subtotalInCents: number;

  totalShippingInCents: number;
  courierServiceId: string;
  amountInCents: string;
  totalWeightInGram: number;
  productName: string;
  image: string;
  status: string;
  trackingNumber: string;
  shippingOrderNumber: string;
  courierName: string;
  createdAt: string;
  updatedAt: string;
  orderItems: IOrderItem[];
  shippings: IShipping[];
}

export interface IbannerImage {
  id: string;
  url: string;
}

export interface IOrderStatusHistory {
  id: string;
  orderId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourierService {
  available_pickup_date?: string[];
  charged_weight: number;
  cod_currency: string | null;
  cod_max_amount: number | null;
  cod_min_charge: number | null;
  cod_rate: number | null;
  cod_percentage?: string;
  company_id: number;
  courier_handle: string;
  courier_image: string;
  courier_title: string;
  groups: Group[];
  is_polystyrene: boolean;
  is_required_printer: boolean;
  is_return_charge: boolean;
  is_sst: boolean;
  last_booking_time: string | null;
  max_working_days: number;
  min_parcel: number | null;
  min_working_days: number;
  name: string | null;
  parcel_value_currency: string;
  pickup_period: string | null;
  price: number;
  service_id: number;
  service_type: string;
  type: string;
  volumetric: number;
  weight: number;
}

interface Group {
  id: number;
  name: string;
  charged_weight: number;
  price: number;
  first_kg: number;
  first_price: number;
  next_price: number;
  next_kg: number;
  min_kg: number;
  max_kg: number;
  is_follow?: boolean;
}

export interface Sender {
  name: string;
  dialing_country_code: "MY" | "SG" | "TH";
  phone: number;
  email?: string; // Optional email
  address_1: string;
  address_2?: string; // Optional address line 2
  postcode: number;
  province: string;
  city: string;
  country: "MY" | "SG" | "TH";
}
