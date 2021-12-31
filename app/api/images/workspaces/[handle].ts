import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db from "db"
import htmlToImage from "../../../htmlToImage"

const handler = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const handle = req.query.handle?.toString()

  const workspace = await db.workspace.findFirst({ where: { handle } })
  const imageBuffer = await htmlToImage(
    `
      <html>
        <head>
          <style>
            * {
              margin: 0;
              padding: 0;
            }

            *,
            *:before,
            *:after {
              box-sizing: border-box;
            }

            html,
            body {
              width: 1200px;
              height: 628px;
              font-family: "Noto Sans Display", "Helvetica", "Arial", sans-serif;
              background: linear-gradient(90deg, #8900ff, rgba(129, 36, 146, 1), rgba(133, 30, 116, 1));
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .module {
              width: 80%;
              margin: auto;
              display: inline-block;
              padding: 1rem;
              justify-content: center;
              align-items: center;
              text-align: center;
            }

            .header {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              vertical-align: middle;
              justify-content: center;
              align-items: center;

            }

            .avatar {
              width: 256px;
              height: 256px;
              border-radius: 50%;
            }

            h1 {
              font-size: 3rem;
              color: white;
            }

            .type {
              font-size: 2rem;
              color: white;
            }

            .logo {
              position: absolute;
              bottom: 10px;
              right: -120px;
              max-width: auto;
              max-height: 40px;
            }

          </style>
        </head>
        <body>
         <div class="module">
         <img src=${workspace!.avatar} class="avatar" />
           <div class="header">
            <h1>${workspace!.name ? workspace!.name : ""}</h1>
             <p class="type">@${workspace!.handle}</p>
             <p class="type">${workspace!.orcid ? workspace!.orcid : ""}</p>
           </div>
         </div>
         <svg width="567" class="logo" height="78" viewBox="0 0 567 78" fill="none" xmlns="http://www.w3.org/2000/svg">
         <g clip-path="url(#clip0_1872_27592)">
         <path d="M117.12 22.53C109.48 22.26 103.12 27.53 102.81 33.69C102.55 38.57 105.51 41.12 110.81 45.91L113.22 48.06C115.28 49.83 117.69 52.06 117.54 54.8C117.41 57.33 114.54 61.75 107.29 61.49C103.47 61.36 100.58 59.66 100.62 58.9C100.633 58.7065 100.686 58.5178 100.776 58.3458C100.865 58.1737 100.989 58.0219 101.14 57.9C102.121 57.0198 102.723 55.7942 102.82 54.48C102.891 54.0149 102.858 53.54 102.725 53.0889C102.592 52.6379 102.361 52.2216 102.049 51.8696C101.737 51.5175 101.351 51.2384 100.92 51.0518C100.488 50.8653 100.02 50.7759 99.5501 50.79C97.1301 50.71 95.8201 52.54 95.7001 54.7C95.5101 58.45 100.77 62.96 107.76 63.21C116.9 63.53 123.66 57.56 124.02 50.62C124.32 44.99 120.19 41.62 117.41 39.38L113.74 36.43C111.4 34.57 109.08 32.51 109.24 29.51C109.41 26.13 112.8 23.9 117 24.04C119.61 24.14 122.62 25.09 122.56 26.31C122.541 26.4909 122.486 26.666 122.396 26.8243C122.307 26.9826 122.185 27.1207 122.04 27.23C121.394 27.8753 120.988 28.7222 120.89 29.63C120.857 30.0378 120.911 30.448 121.049 30.8334C121.186 31.2188 121.404 31.5706 121.687 31.8655C121.971 32.1605 122.314 32.3918 122.694 32.5443C123.073 32.6968 123.481 32.7669 123.89 32.75C124.352 32.7798 124.814 32.7157 125.25 32.5617C125.686 32.4076 126.086 32.1667 126.427 31.8536C126.767 31.5404 127.04 31.1615 127.23 30.7398C127.419 30.3181 127.522 29.8623 127.53 29.4C127.78 25.73 123.57 22.79 117.12 22.53Z" fill="white"/>
         <path d="M561.81 39.56L543.74 37.16C543.335 37.1114 542.962 36.9173 542.689 36.6137C542.417 36.3101 542.264 35.9178 542.26 35.51V32.71C542.253 32.4942 542.293 32.2794 542.378 32.0807C542.462 31.882 542.589 31.7043 542.75 31.56L542.83 31.47C542.982 31.3159 543.162 31.1933 543.361 31.1092C543.56 31.0251 543.774 30.9812 543.99 30.98H556.36C556.576 30.9801 556.79 31.0235 556.99 31.1077C557.189 31.1918 557.369 31.315 557.52 31.47L561.07 35.02L566.92 29.16L562.14 24.38C561.623 23.8445 561 23.4216 560.312 23.1377C559.624 22.8537 558.884 22.7149 558.14 22.73H542.26C541.507 22.7086 540.758 22.8443 540.061 23.1284C539.364 23.4125 538.733 23.8387 538.21 24.38L534.58 28.01C534.02 28.5548 533.578 29.2085 533.28 29.9309C532.983 30.6532 532.836 31.4289 532.85 32.21V38.98C532.907 40.3762 533.45 41.7087 534.385 42.7475C535.32 43.7862 536.588 44.4662 537.97 44.67L555.97 47.07C556.377 47.1162 556.753 47.3094 557.027 47.6132C557.301 47.9171 557.455 48.3106 557.46 48.72V52.02C557.465 52.2364 557.422 52.4512 557.336 52.6497C557.25 52.8482 557.121 53.0257 556.96 53.17L556.88 53.25C556.73 53.4063 556.55 53.531 556.35 53.6169C556.151 53.7028 555.937 53.748 555.72 53.75H543.41C543.195 53.7467 542.982 53.7008 542.785 53.615C542.588 53.5292 542.409 53.4051 542.26 53.25L538.71 49.71L532.85 55.56L537.64 60.35C538.158 60.885 538.78 61.3076 539.468 61.5914C540.156 61.8753 540.896 62.0144 541.64 62H557.48C558.224 62.0144 558.964 61.8753 559.652 61.5914C560.34 61.3076 560.962 60.885 561.48 60.35L565.11 56.72C565.671 56.174 566.114 55.5186 566.412 54.7945C566.709 54.0703 566.855 53.2927 566.84 52.51V45.25C566.787 43.8669 566.257 42.5449 565.34 41.5079C564.423 40.4709 563.176 39.7827 561.81 39.56V39.56Z" fill="white"/>
         <path d="M506.38 8.25H514.71V62H524.12V0H506.38V8.25Z" fill="white"/>
         <path d="M76.95 61.16C69.59 61.16 69.59 53.51 69.59 51.64C69.5117 49.1859 69.7913 46.7335 70.42 44.36C78.05 44.64 96.64 42.31 96.64 31.2C96.64 25.98 91.64 22.4301 85.14 22.4301C81.641 22.5336 78.201 23.358 75.035 24.8515C71.869 26.345 69.0452 28.4756 66.74 31.11C63.1193 35.4666 61.1068 40.9357 61.04 46.6C61.04 56.4 67.66 63.12 75.85 63.12C80.85 63.12 86.85 60.56 92.37 53.23L91.19 52.03C86.66 56.88 82.74 61.16 76.95 61.16ZM84.77 24.16C85.4637 24.1043 86.1613 24.1983 86.8156 24.4355C87.4698 24.6727 88.0655 25.0476 88.5623 25.535C89.0591 26.0223 89.4455 26.6106 89.6953 27.2602C89.945 27.9098 90.0524 28.6054 90.01 29.3C90.01 34.43 82.93 42.55 70.79 42.83C71.66 37.45 75.48 24.2 84.77 24.2V24.16Z" fill="white"/>
         <path d="M51.28 59.02C50.74 57.95 50.6601 56.62 50.5701 53.77V50.93C50.4801 41.51 50.1201 33.42 35.3701 28.98C39.8101 28.71 48.97 28.09 54.3 22.49C55.563 21.2157 56.5592 19.7024 57.2306 18.0386C57.9019 16.3749 58.2349 14.594 58.2101 12.8C58.2101 10.22 57.59 3.29001 49.41 0.890015C46.41 1.46627e-05 43.54 0 39.72 0H12.7901L12.2601 1.87H20.66L8.13005 60.87H0.490051L0.0500488 62.74H25.8201L26.1801 60.87H18L24.66 29.6H28.75C31.24 29.69 34.2601 29.78 36.4801 32.35C38.7001 34.92 38.88 38.49 39.06 41.24L39.42 47.37C39.77 53.24 40.31 63.73 52.3 63.73C54.5603 63.7241 56.8075 63.3872 58.97 62.73V60.86C57.8144 61.2164 56.6182 61.4247 55.41 61.48C54.5579 61.5109 53.715 61.2953 52.9824 60.8589C52.2498 60.4226 51.6587 59.784 51.28 59.02ZM25.06 27.64L30.66 1.87H39.0101C42.3901 1.87 47.9001 1.96002 47.9001 9.96002C47.9001 14.31 46.0301 21.33 43.3701 24.09C40.1701 27.38 35.19 27.46 28.97 27.64H25.06Z" fill="white"/>
         <path d="M147.66 61.16C140.3 61.16 140.3 53.51 140.3 51.64C140.222 49.1859 140.501 46.7335 141.13 44.36C148.76 44.64 167.35 42.31 167.35 31.2C167.35 25.98 162.35 22.4301 155.85 22.4301C152.351 22.5342 148.911 23.3588 145.745 24.8523C142.579 26.3458 139.756 28.4761 137.45 31.11C133.829 35.4666 131.817 40.9357 131.75 46.6C131.75 56.4 138.37 63.12 146.56 63.12C151.56 63.12 157.56 60.56 163.07 53.23L161.9 52.04C157.35 56.88 153.4 61.16 147.66 61.16ZM155.48 24.16C156.174 24.1043 156.871 24.1983 157.526 24.4355C158.18 24.6727 158.775 25.0476 159.272 25.535C159.769 26.0223 160.155 26.6106 160.405 27.2602C160.655 27.9098 160.762 28.6054 160.72 29.3C160.72 34.43 153.64 42.55 141.5 42.83C142.27 37.45 146.14 24.2 155.43 24.2L155.48 24.16Z" fill="white"/>
         <path d="M406.82 28.34L402.82 24.34C402.304 23.803 401.682 23.3791 400.993 23.0951C400.305 22.8111 399.565 22.6731 398.82 22.69H388.42C387.676 22.675 386.936 22.8137 386.248 23.0977C385.559 23.3816 384.937 23.8045 384.42 24.34L380.79 27.97C380.23 28.5148 379.788 29.1686 379.49 29.8909C379.193 30.6132 379.046 31.3889 379.06 32.17V52.47C379.047 53.2524 379.194 54.0293 379.491 54.7531C379.789 55.4769 380.231 56.1326 380.79 56.68L384.42 60.31C384.939 60.8435 385.561 61.2652 386.249 61.549C386.937 61.8327 387.676 61.9726 388.42 61.96H398.82C399.564 61.9744 400.304 61.8353 400.992 61.5515C401.68 61.2676 402.302 60.845 402.82 60.31L405.96 57.17V77.79H415.36V29.25L416.68 22.73H408.1L406.82 28.34ZM406 46.24C406.005 46.458 405.963 46.6745 405.877 46.8748C405.791 47.075 405.662 47.2542 405.5 47.4L399.66 53.25C399.511 53.4051 399.332 53.5292 399.135 53.615C398.938 53.7008 398.725 53.7467 398.51 53.75H390.16C389.943 53.748 389.729 53.7028 389.53 53.6169C389.33 53.5311 389.15 53.4063 389 53.25L388.92 53.17C388.759 53.0257 388.63 52.8482 388.544 52.6497C388.458 52.4512 388.415 52.2364 388.42 52.02V32.71C388.414 32.4934 388.456 32.2781 388.542 32.0794C388.629 31.8807 388.758 31.7034 388.92 31.56L389 31.47C389.151 31.315 389.331 31.1918 389.53 31.1077C389.73 31.0235 389.944 30.9801 390.16 30.98H398.49C398.705 30.9814 398.917 31.0255 399.114 31.1096C399.312 31.1937 399.49 31.3162 399.64 31.47L405.5 37.33C405.662 37.4758 405.791 37.655 405.877 37.8552C405.963 38.0554 406.005 38.272 406 38.49V46.24Z" fill="white"/>
         <path d="M318.32 58.08C317.48 58.92 316.18 59.95 315.06 59.95C313.57 59.95 313.38 58.64 313.38 57.52C313.501 55.8236 313.813 54.1463 314.31 52.52L318.14 35.91C318.814 33.6279 319.25 31.282 319.44 28.91C319.44 24.06 314.87 22.47 311.89 22.47C304.42 22.47 297.81 27.67 294.48 33.47L301.98 0.0999756H284.71L284.37 1.96997H292.96L279.76 62.03H288.26L292.5 43.46C293.5 38.88 294.5 35.46 298.5 31.14C303.08 26.29 306.99 25.73 308.11 25.73C308.524 25.681 308.944 25.7234 309.339 25.8542C309.735 25.985 310.098 26.2011 310.401 26.4872C310.704 26.7732 310.941 27.1223 311.094 27.5098C311.248 27.8973 311.315 28.3139 311.29 28.73C311.218 29.6164 311.061 30.4938 310.82 31.35L306.66 49.59C305.45 54.35 305.17 55.59 305.17 57.05C305.17 62.28 309.65 62.93 311.6 62.93C313.12 62.9036 314.618 62.5579 315.996 61.9153C317.375 61.2727 318.602 60.3476 319.6 59.2C321.331 57.3963 322.827 55.3802 324.05 53.2L322.83 51.97C321.63 54.2137 320.11 56.2718 318.32 58.08V58.08Z" fill="white"/>
         <path d="M262.31 61.25C254.85 61.25 254.85 52.95 254.85 51.17C254.85 44.55 257.37 35.4 260.35 30.74C262.78 26.82 266.42 24.02 270.35 24.02C273.8 24.02 274.92 26.44 274.92 26.91C274.92 27.56 274.55 27.75 273.99 28.03C273.333 28.4002 272.776 28.9254 272.369 29.5598C271.961 30.1942 271.714 30.9186 271.65 31.67C271.703 32.6004 272.11 33.4753 272.786 34.1164C273.463 34.7575 274.358 35.1164 275.29 35.12C276.565 35.0553 277.765 34.4976 278.636 33.5646C279.508 32.6316 279.982 31.3964 279.96 30.12C279.96 26.48 276.51 22.47 269.51 22.47C265.816 22.6192 262.202 23.5995 258.939 25.3377C255.675 27.0759 252.845 29.5274 250.66 32.51C247.635 36.4913 245.935 41.3215 245.8 46.32C245.8 55.65 252.43 63.12 261.2 63.12C267.12 63.12 273.04 59.77 277.61 53.12L276.22 51.79C272.94 56.1 268.55 61.25 262.31 61.25Z" fill="white"/>
         <path d="M334.72 61.9999H371.6V52.5899H344.62V34.5799H371.6V25.1799H344.62V9.46995H371.6V0.0699463H334.72V61.9999Z" fill="white"/>
         <path d="M459.03 22.73H449.66V46.24C449.665 46.458 449.623 46.6745 449.537 46.8748C449.451 47.075 449.322 47.2542 449.16 47.4L442.66 53.79C442.51 53.9463 442.33 54.0711 442.13 54.1569C441.931 54.2428 441.717 54.288 441.5 54.29H436.39C436.175 54.2867 435.962 54.2408 435.765 54.155C435.568 54.0692 435.389 53.9451 435.24 53.79L434.57 53.13C434.41 52.9852 434.283 52.8074 434.199 52.6089C434.114 52.4103 434.073 52.1957 434.08 51.98V22.73H424.66V52.51C424.647 53.2934 424.794 54.0712 425.094 54.7953C425.393 55.5194 425.838 56.1745 426.4 56.72L430.03 60.35C430.548 60.885 431.17 61.3076 431.858 61.5915C432.546 61.8753 433.286 62.0144 434.03 62H442.36C443.104 62.0144 443.844 61.8753 444.532 61.5915C445.22 61.3076 445.842 60.885 446.36 60.35L450.36 56.35L451.68 61.96H460.66L459.01 55.11L459.03 22.73Z" fill="white"/>
         <path d="M504.24 51.36V32.21C504.254 31.4289 504.107 30.6533 503.81 29.9309C503.512 29.2086 503.07 28.5548 502.51 28.01L498.88 24.38C497.811 23.332 496.377 22.7403 494.88 22.73H477.26C476.517 22.7271 475.781 22.8714 475.095 23.1546C474.408 23.4379 473.785 23.8543 473.26 24.38L469.05 28.59L474.5 34.03L477.06 31.47C477.21 31.3162 477.388 31.1937 477.586 31.1096C477.783 31.0255 477.995 30.9815 478.21 30.98H493.14C493.356 30.9801 493.57 31.0236 493.77 31.1077C493.969 31.1919 494.149 31.315 494.3 31.47L494.38 31.56C494.542 31.7034 494.671 31.8807 494.758 32.0794C494.844 32.2782 494.886 32.4934 494.88 32.71V37.33H476.66C475.917 37.3282 475.182 37.473 474.495 37.7562C473.809 38.0393 473.185 38.4552 472.66 38.98L469.61 42.03C469.051 42.5774 468.609 43.2331 468.311 43.9569C468.014 44.6807 467.867 45.4576 467.88 46.24V52.51C467.867 53.2925 468.014 54.0693 468.311 54.7932C468.609 55.517 469.051 56.1726 469.61 56.72L473.24 60.35C473.759 60.8836 474.381 61.3052 475.069 61.589C475.757 61.8728 476.496 62.0126 477.24 62H491.85C492.593 62.0029 493.329 61.8586 494.015 61.5754C494.702 61.2922 495.325 60.8757 495.85 60.35L498.16 58.04L502.16 62.04L508.16 56.04L504.7 52.57C504.538 52.4155 504.412 52.2266 504.333 52.0172C504.253 51.8078 504.221 51.5833 504.24 51.36ZM494.84 49.13C494.845 49.3464 494.802 49.5613 494.716 49.7598C494.63 49.9583 494.501 50.1358 494.34 50.28L491.34 53.28C491.191 53.4352 491.012 53.5592 490.815 53.645C490.618 53.7309 490.405 53.7767 490.19 53.78H479C478.783 53.778 478.569 53.7328 478.37 53.647C478.17 53.5611 477.99 53.4363 477.84 53.28L477.76 53.2C477.599 53.0558 477.47 52.8783 477.384 52.6798C477.298 52.4813 477.255 52.2664 477.26 52.05V46.79C477.255 46.572 477.297 46.3555 477.383 46.1552C477.469 45.955 477.598 45.7758 477.76 45.63L477.84 45.55C477.99 45.3937 478.17 45.2689 478.37 45.1831C478.569 45.0972 478.783 45.052 479 45.05H494.84V49.13Z" fill="white"/>
         <path d="M248.86 26.4399C248.86 24.1999 246.86 22.4399 244.1 22.4399C237.47 22.4399 232.9 31.31 231.5 33.92L233.83 23.5599H217.31L216.85 25.43H225.34L216.85 62.0099H225.25L227.95 50.4399C230.85 38.4399 232.15 35.3199 235.6 30.5599C236.6 29.1599 238.31 26.83 239.52 26.83C240.18 26.83 240.36 27.29 240.74 27.83C241.101 28.6202 241.677 29.2933 242.402 29.7724C243.127 30.2515 243.971 30.5174 244.84 30.5399C245.913 30.5165 246.934 30.0745 247.685 29.3084C248.436 28.5423 248.858 27.5128 248.86 26.4399V26.4399Z" fill="white"/>
         <path d="M207.75 57.52C206.26 59.01 204.97 59.66 204.04 59.66C202.47 59.66 202.1 58.55 202.1 57.33C202.444 54.4698 202.969 51.6341 203.67 48.84L209.6 23.55H201.17L200.06 28.31C199.569 26.9733 198.742 25.7853 197.66 24.86C195.809 23.2615 193.436 22.397 190.99 22.43C181.74 22.43 169.61 33.54 169.61 47.81C169.61 58.08 176.74 63.12 182.75 63.12C189.88 63.12 193.49 57.33 194.6 55.56C194.97 60.56 197.75 62.93 201.08 62.93C206.17 62.93 210.42 57.53 212.88 53.15L211.66 51.92C210.634 53.9658 209.317 55.8521 207.75 57.52V57.52ZM196.55 44.08C195.34 49.21 192.47 61.16 184.24 61.16C179.7 61.16 177.94 57.33 177.94 52.95C177.94 47.63 181.18 36.43 183.31 32.13C185.99 26.72 189.6 24.48 192.38 24.48C195.81 24.48 198.67 27.56 198.67 32.6C198.66 35.31 197.29 41.19 196.55 44.08Z" fill="white"/>
         </g>
         <defs>
         <clipPath id="clip0_1872_27592">
         <rect width="566.93" height="77.75" fill="white"/>
         </clipPath>
         </defs>
         </svg>

        </body>
      </html>
      `
  )

  res.statusCode = 200

  res.setHeader("Content-Type", "image/png")
  res.end(imageBuffer)
}
export default handler
