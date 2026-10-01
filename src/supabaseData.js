import { supabase } from "./supabase";

export async function uploadEvent({
  event_name,
  start_time,
  venue,
  image,
  form_link,
  event_type,
}) {
  if (!image) throw new Error("No image provided");

  const fileName = `${Date.now()}_${image.name}`;
  const bucketName = "event-posters";

  // Upload image
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, image);

  if (uploadError) {
    throw new Error("Image upload failed: " + uploadError.message);
  }

  // Get public URL
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  const publicUrl = data.publicUrl;

  // Insert event
  const { error: insertError } = await supabase
    .from("Events")
    .insert([
      {
        Name: event_name,
        Venue: venue,
        Time: start_time,
        img_url: publicUrl,
        gform_link: form_link,
        category: event_type,
      },
    ]);

  if (insertError) {
    throw new Error("Insert failed: " + insertError.message);
  }

  return publicUrl;
}