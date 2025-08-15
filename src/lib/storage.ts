import { supabase } from './supabase';

export const uploadPlayerImage = async (file: File, playerId: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${playerId}-${Date.now()}.${fileExt}`;
    const filePath = `players/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('player-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('player-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const uploadPlayerDocument = async (
  file: File, 
  playerId: string, 
  documentType: 'aadhar' | 'birth' | 'irbf'
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${playerId}-${documentType}-${Date.now()}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('player-documents')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Document upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('player-documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading document:', error);
    return null;
  }
};
export const deletePlayerImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `players/${fileName}`;

    const { error } = await supabase.storage
      .from('player-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};
export const deletePlayerDocument = async (documentUrl: string): Promise<boolean> => {
  try {
    // Extract file path from URL
    const urlParts = documentUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `documents/${fileName}`;

    const { error } = await supabase.storage
      .from('player-documents')
      .remove([filePath]);

    if (error) {
      console.error('Delete document error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
};