import { supabase } from './supabase';

export interface InvoiceLineItem {
  id?: string;
  invoice_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  sort_order: number;
}

export interface Invoice {
  id?: string;
  invoice_number?: string;
  invoice_type: 'proforma' | 'invoice';
  customer_id: string;
  issue_date: string;
  due_date?: string;
  valid_until?: string;
  reference?: string;
  billing_company_name: string;
  billing_address_line_1: string;
  billing_address_line_2?: string;
  billing_city: string;
  billing_postcode: string;
  billing_country: string;
  service_location_name?: string;
  service_address_line_1?: string;
  service_address_line_2?: string;
  service_city?: string;
  service_postcode?: string;
  service_country?: string;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  payment_terms?: string;
  notes?: string;
  paid_date?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceWithItems extends Invoice {
  line_items: InvoiceLineItem[];
}

export const invoiceService = {
  async generateInvoiceNumber(invoiceType: 'proforma' | 'invoice'): Promise<string> {
    const { data, error } = await supabase.rpc('generate_invoice_number', {
      invoice_type_param: invoiceType
    });

    if (error) throw error;
    return data;
  },

  async createInvoice(invoice: Invoice, lineItems: InvoiceLineItem[]): Promise<string> {
    if (!invoice.invoice_number) {
      invoice.invoice_number = await this.generateInvoiceNumber(invoice.invoice_type);
    }

    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices_v2')
      .insert(invoice)
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    const itemsWithInvoiceId = lineItems.map(item => ({
      ...item,
      invoice_id: invoiceData.id
    }));

    const { error: itemsError } = await supabase
      .from('invoice_line_items')
      .insert(itemsWithInvoiceId);

    if (itemsError) throw itemsError;

    return invoiceData.id;
  },

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<void> {
    const { error } = await supabase
      .from('invoices_v2')
      .update(invoice)
      .eq('id', id);

    if (error) throw error;
  },

  async updateLineItems(invoiceId: string, lineItems: InvoiceLineItem[]): Promise<void> {
    await supabase
      .from('invoice_line_items')
      .delete()
      .eq('invoice_id', invoiceId);

    const itemsWithInvoiceId = lineItems.map(item => ({
      ...item,
      invoice_id: invoiceId
    }));

    const { error } = await supabase
      .from('invoice_line_items')
      .insert(itemsWithInvoiceId);

    if (error) throw error;
  },

  async getInvoice(id: string): Promise<InvoiceWithItems | null> {
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices_v2')
      .select('*')
      .eq('id', id)
      .single();

    if (invoiceError) throw invoiceError;
    if (!invoice) return null;

    const { data: lineItems, error: itemsError } = await supabase
      .from('invoice_line_items')
      .select('*')
      .eq('invoice_id', id)
      .order('sort_order');

    if (itemsError) throw itemsError;

    return {
      ...invoice,
      line_items: lineItems || []
    };
  },

  async listInvoices(filters?: {
    customer_id?: string;
    status?: string;
    invoice_type?: string;
  }): Promise<Invoice[]> {
    let query = supabase
      .from('invoices_v2')
      .select('*')
      .order('issue_date', { ascending: false });

    if (filters?.customer_id) {
      query = query.eq('customer_id', filters.customer_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.invoice_type) {
      query = query.eq('invoice_type', filters.invoice_type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async deleteInvoice(id: string): Promise<void> {
    const { error } = await supabase
      .from('invoices_v2')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async markAsPaid(id: string, paidDate: string): Promise<void> {
    const { error } = await supabase
      .from('invoices_v2')
      .update({
        status: 'paid',
        paid_date: paidDate
      })
      .eq('id', id);

    if (error) throw error;
  },

  async markAsSent(id: string): Promise<void> {
    const { error } = await supabase
      .from('invoices_v2')
      .update({ status: 'sent' })
      .eq('id', id);

    if (error) throw error;
  },

  formatCurrency(amount: number): string {
    return `£${amount.toFixed(2)}`;
  },

  calculateLineTotal(quantity: number, unitPrice: number): number {
    return Math.round(quantity * unitPrice * 100) / 100;
  },

  calculateVAT(subtotal: number, vatRate: number): number {
    return Math.round(subtotal * vatRate) / 100;
  },

  calculateTotal(subtotal: number, vatAmount: number): number {
    return Math.round((subtotal + vatAmount) * 100) / 100;
  }
};
