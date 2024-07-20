export type InvoicesTable = {
    id: string;
    customer_id: string;
    name: string;
    email: string;
    image_url: string;
    date: string;
    amount: number;
    status: 'pending' | 'paid';
};

export type SupplierForm = {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    url: string;
    notes: string;
    contact: string;
    contact_number: string;
  };