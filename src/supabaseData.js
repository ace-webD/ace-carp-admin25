import { supabase } from "./supabase";

export async function uploadEvent({
  event_name,
  event_conductedby,
  description,
  event_date,
  start_time,
  end_time,
  venue,
  image,
  event_type,
  form_link
}) {
  if (!image) throw new Error("No image provided");

  const fileName = `${Date.now()}_${image.name}`;
  const bucketName = "event-images";

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, image);

  if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

  const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
  const publicUrl = data.publicUrl;

  const { error: insertError } = await supabase
    .from("event_details")
    .insert([
      {
        event_name,
        description,
        event_date,
        start_time,
        end_time,
        venue,
        image_url: publicUrl,
        event_type,
        event_conductedby,
        form_link,
      },
    ]);

  if (insertError) throw new Error("Insert failed: " + insertError.message);

  return publicUrl;
}
