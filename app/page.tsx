import CreatePostForm from '@/components/create-post-form';
import Posts from '@/components/posts';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <CreatePostForm />
      <Posts />
    </div>
  );
}
