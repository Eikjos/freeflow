'use client';

import { uploadImg } from 'actions/media';
import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { cn, getMediaUrl } from '../../../lib/utils';
import '../../editor.css';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Label } from './label';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
});

type EditorProps = {
  name?: string;
  className?: string;
  label?: string;
} & Omit<ComponentProps<'input'>, 'name'>;

const uploadAndReplace = async (value?: string) => {
  if (!value) return { value, images: [] };

  const parser = new DOMParser();
  const doc = parser.parseFromString(value, 'text/html');
  const images = doc.querySelectorAll('img');
  const uploadedsImages: number[] = [];
  for (const img of images) {
    if (img.src.startsWith('data:')) {
      const uploadedUrl = await uploadImg(img.src);
      img.setAttribute('src', getMediaUrl(uploadedUrl));
      uploadedsImages.push(uploadedUrl);
    }
  }

  return { value: doc.body.innerHTML, images: uploadedsImages };
};

const Editor = ({ className, label, name, placeholder }: EditorProps) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'code-block'],
      ['clean'],
    ],
  };

  const formats = ['bold', 'italic', 'underline', 'list', 'image'];

  return (
    <>
      {name ? (
        <FormField
          name={name}
          render={({ field }) => (
            <FormItem className={cn(className)}>
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <ReactQuill
                  theme="snow"
                  formats={formats}
                  modules={modules}
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <div className={cn(className)}>
          {label && <Label>{label}</Label>}
          <ReactQuill theme="snow" formats={formats} modules={modules} />
        </div>
      )}
    </>
  );
};

export { Editor, uploadAndReplace };
