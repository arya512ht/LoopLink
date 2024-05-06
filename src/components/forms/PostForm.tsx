import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
} from "@/components/ui";
import { PostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { FileUploader, Loader } from "@/components/shared";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  const [generatedCaptions, setGeneratedCaptions] = useState<any[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]); // State variable for location suggestions
  const [loadingLocations, setLoadingLocations] = useState(false); // State variable to track loading state

  // Function to fetch location suggestions
  const fetchLocationSuggestions = async (text: string) => {
    try {
      setLoadingLocations(true);
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&apiKey=899101682d614c049885ebf2b1f7a7b6`
      );
      setLocationSuggestions(response.data.features);
    } catch (error) {
      console.log("Error fetching location suggestions:", error);
    } finally {
      setLoadingLocations(false);
    }
  };

  // Effect to fetch location suggestions when location input value changes
  useEffect(() => {
    if (form.getValues("location")) {
      fetchLocationSuggestions(form.getValues("location"));
    }
  }, [form.getValues("location")]);

  // JSX for rendering location suggestions dropdown
  const renderLocationSuggestions = () => {
    if (loadingLocations) {
      return <div>Loading...</div>;
    }
    return (
      <ul>
        {locationSuggestions.map((suggestion: any) => (
          <li key={uuidv4()} onClick={() => handleLocationSelection(suggestion)}>
            {suggestion.properties.formatted}
          </li>
        ))}
      </ul>
    );
  };


  // Function to handle location selection from suggestions
  const handleLocationSelection = (selectedLocation: any) => {
    form.setValue("location", selectedLocation.properties.formatted);
  };

  const generateCaptions = async (imageFile: File) => {
    try {
      try {
        let formData = new FormData()
        formData.append('file', imageFile)
        const response = await axios.post("https://image-caption-generator-brb5.onrender.com/image", formData);
        setGeneratedCaptions(response.data.captions);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error generating captions. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error reading image file:", error);
      toast({
        title: "Error reading image file. Please try again.",
      });
    }
  };

  useEffect(() => {
    if (post && post.imageFile) {
      generateCaptions(post.imageFile);
    }
  }, [post]);

  const { mutateAsync: createPost, isLoading: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isLoading: isLoadingUpdate } =
    useUpdatePost();

  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...value,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      });

      if (!updatedPost) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }
      return navigate(`/posts/${post.$id}`);
    }

    const newPost = await createPost({
      ...value,
      userId: user.id,
    });

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`,
      });
    }
    navigate("/");
  };

  // CSS styles embedded within the component
  const styles = `
    .generated-captions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .caption-item {
      background-color: #f0f0f0;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
    }

    .caption-item:hover {
      background-color: #e0e0e0;
    }

    .caption-tags {
      margin-top: 5px;
    }

    .caption-tags span {
      margin-right: 5px;
      color: #666;
    }
  `;

  return (
    <Form {...form}>
      <style>{styles}</style>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
              <div>
                <Button
                  type="button"
                  className="shad-button_primary"
                  style={{ marginBottom: "10px" }} // Adding margin-bottom here
                  onClick={() => {
                    if (form.getValues("file").length > 0) {
                      generateCaptions(form.getValues("file")[0]);
                    } else {
                      toast({
                        title: "Please upload an image first.",
                      });
                    }
                  }}
                >
                  Generate Captions
                </Button>
                <div className="generated-captions">
                  {generatedCaptions.map((caption, index) => (
                    <div key={index} className="caption-item">
                      <Button
                        type="button"
                        className="shad-button_primary"
                        onClick={() => {
                          const selectedCaption = caption.caption;
                          const selectedTags = caption.hashtags.map((hash: any) => `#${hash}`).join(" ");
                          const currentCaptionValue = form.getValues("caption");

                          form.setValue("caption", `${currentCaptionValue ? currentCaptionValue + ' ' : ''}${selectedCaption} ${selectedTags}`);
                        }}
                      >
                        {caption.caption}
                      </Button>

                      <div className="caption-tags">
                        {caption.hashtags.map((hash: any, i: any) => (
                          <span key={i}>#{hash}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
        
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    fetchLocationSuggestions(e.target.value); // Fetch suggestions on input change
                  }}
                  value={form.getValues("location")} // Set the value of the input to the current value of the location field in the form
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
              {/* Render location suggestions dropdown */}
              {renderLocationSuggestions()}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;

