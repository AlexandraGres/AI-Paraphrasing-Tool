import Head from 'next/head';
import Paraphraser from '@/components/Paraphraser';

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Paraphrasing Tool</title>
        <meta name='description' content='AI Text Paraphraser by JustDone' />
        <meta
          name='keywords'
          content='paraphrasing tool, rewriter, rephrase text, sentence rephraser, avoid plagiarism, AI rephraser'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Paraphraser />
    </>
  );
}
