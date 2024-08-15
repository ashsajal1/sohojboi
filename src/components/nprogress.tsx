// Create a Providers component to wrap your application with all the components requiring 'use client', such as next-nprogress-bar or your different contexts...
'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const Nprogress = () => {
  const randomHighlightColors = ['#cafc03', '#fc3503', '#030bfc','#f403fc', '#03d7fc'];
  const randomColor = randomHighlightColors[Math.floor(Math.random() * randomHighlightColors.length)];
  return (
    <>
      <ProgressBar
        height="3px"
        color={randomColor}
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default Nprogress;