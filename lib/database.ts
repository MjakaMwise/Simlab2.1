import { supabase, StudentRegistration, SchoolPartnership, ContactSubmission, GalleryImage } from '../lib/supabase';

export const studentRegistrationService = {
  async create(registration: StudentRegistration) {
    const { data, error } = await supabase
      .from('student_registrations')
      .insert([registration])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('student_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('student_registrations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updatePaymentStatus(id: string, status: 'pending' | 'confirmed' | 'failed', amount?: number) {
    const updateData: any = { payment_status: status };
    if (amount !== undefined) {
      updateData.amount_paid = amount;
    }

    const { data, error } = await supabase
      .from('student_registrations')
      .update(updateData)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};

export const schoolPartnershipService = {
  async create(partnership: SchoolPartnership) {
    const { data, error } = await supabase
      .from('school_partnerships')
      .insert([partnership])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('school_partnerships')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('school_partnerships')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: 'inquiry' | 'negotiating' | 'confirmed' | 'declined') {
    const { data, error } = await supabase
      .from('school_partnerships')
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};

export const contactSubmissionService = {
  async create(submission: ContactSubmission) {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([submission])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: 'new' | 'read' | 'responded' | 'archived') {
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};

export const galleryService = {
  async getActiveImages(category?: string) {
    let query = supabase
      .from('gallery_images')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async create(image: GalleryImage) {
    const { data, error } = await supabase
      .from('gallery_images')
      .insert([image])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async update(id: string, image: Partial<GalleryImage>) {
    const { data, error } = await supabase
      .from('gallery_images')
      .update(image)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
