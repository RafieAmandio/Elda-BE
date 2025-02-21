const supabase = require('../config/supabase');

class MemoService {
  static async createMemo(memoData) {
    try {
      const { data, error } = await supabase
        .from('memos')
        .insert([{
          userid: memoData.userid,
          text: memoData.text
          // created_at will be automatically handled by Supabase
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create memo error:', error);
      throw error;
    }
  }

  static async getMemosByUserId(userid) {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('userid', userid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get memos error:', error);
      throw error;
    }
  }

  static async getMemoById(id) {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get memo error:', error);
      throw error;
    }
  }

  static async updateMemo(id, text) {
    try {
      const { data, error } = await supabase
        .from('memos')
        .update({ text })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update memo error:', error);
      throw error;
    }
  }

  static async deleteMemo(id) {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete memo error:', error);
      throw error;
    }
  }
}

module.exports = { MemoService };