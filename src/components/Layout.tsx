import { Typography } from '@mui/material';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <Typography
          sx={{ fontSize: 44, fontWeight: 700, mb: 2 }}
          align='center'
          variant='h1'
        >
          AI Text Paraphraser by JustDone
        </Typography>
        <Typography
          sx={{ fontSize: 22, fontWeight: 500 }}
          align='center'
          variant='h2'
        >
          Transform your writing from good to great with our Paraphraser tool.
        </Typography>
      </header>
      <main>{children}</main>
    </>
  );
}
