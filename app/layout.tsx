import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PrelineScript from "./components/PrelineScript";
import Head from 'next/head'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Starrysky Admin Console",
  description: "Starrysky Admin Console Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {process.env.NODE_ENV==='production' && <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "5c79c92452d1413aa833d32da71489fe"}'></script>}
      <body className={inter.className}>{children}

        <div className="bg-white pt-4 sm:pt-10 lg:pt-12">
          <footer className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="flex flex-col items-center justify-between gap-4 border-t border-b py-6 md:flex-row">
              <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-start md:gap-6">
                <a href="https://blog.usounds.work/posts/starry-sky-01/" className="text-gray-500 transition duration-100 hover:text-gray-700">Query Engine Setup</a>
              </nav>
              <div className="flex gap-4 px-2 md:px-2 items-center">

                <a href="https://bsky.app/profile/usounds.work" target="_blank" className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600">
                  <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 1452 1452" xmlns="http://www.w3.org/2000/svg"><path d="M725.669,684.169c85.954,-174.908 196.522,-329.297 331.704,-463.171c45.917,-43.253 98.131,-74.732 156.638,-94.443c80.779,-23.002 127.157,10.154 139.131,99.467c-2.122,144.025 -12.566,287.365 -31.327,430.015c-29.111,113.446 -96.987,180.762 -203.629,201.947c-36.024,5.837 -72.266,8.516 -108.726,8.038c49.745,11.389 95.815,32.154 138.21,62.292c77.217,64.765 90.425,142.799 39.62,234.097c-37.567,57.717 -83.945,104.938 -139.131,141.664c-82.806,48.116 -154.983,33.716 -216.529,-43.202c-28.935,-38.951 -52.278,-81.818 -70.026,-128.603c-12.177,-34.148 -24.156,-68.309 -35.935,-102.481c-11.779,34.172 -23.757,68.333 -35.934,102.481c-17.748,46.785 -41.091,89.652 -70.027,128.603c-61.545,76.918 -133.722,91.318 -216.529,43.202c-55.186,-36.726 -101.564,-83.947 -139.131,-141.664c-50.804,-91.298 -37.597,-169.332 39.62,-234.097c42.396,-30.138 88.466,-50.903 138.21,-62.292c-36.46,0.478 -72.702,-2.201 -108.725,-8.038c-106.643,-21.185 -174.519,-88.501 -203.629,-201.947c-18.762,-142.65 -29.205,-285.99 -31.328,-430.015c11.975,-89.313 58.352,-122.469 139.132,-99.467c58.507,19.711 110.72,51.19 156.637,94.443c135.183,133.874 245.751,288.263 331.704,463.171Z" fill="currentColor" /></svg>
                </a>

                <div className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600">
                  <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>

                <a href="https://github.com/usounds/StarryskyQueryEngine" target="_blank" className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600">
                  Query Engine
                </a>

                <a href="https://github.com/usounds/StarryskyAdminConsole" target="_blank" className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600">Admin Console
                </a>


              </div>
            </div>

            <div className="py-8 text-center text-sm text-gray-400">© 2024 - usounds. All rights reserved.</div>
          </footer>
        </div>

      </body>

      <PrelineScript />
    </html>
  );
}
