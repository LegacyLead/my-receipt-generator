'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../lib/supabase';
import { Store, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

const LOGO_SRC = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAFQAR4DASIAAhEBAxEB/8QAHQABAAEEAwEAAAAAAAAAAAAAAAgBBQYHAgQJA//EAE8QAAEDAwIDBQQHBAcFAw0AAAEAAgMEBREGIQcSMQgTQVFhInGBkRQyQlKhscEVI2JyM0OSwtHh8BYkU6LSVoKyCRcYJjQ1N2RzlbPT8f/EABsBAQACAwEBAAAAAAAAAAAAAAAEBQEDBgIH/8QANREAAgIBAwMCBAUDAgcAAAAAAAECAwQFESESMUETIgYyUWEUI3GBoUKRsdHwFRYkNGLB4f/aAAwDAQACEQMRAD8AmUiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIioUBVFTKE+5A+Ai4gk+Sr8VhtrwFyckVEWTG5VFTIRByVRUGVVDIREQBERAEREAREQBERAEREAREQBERAEREARFRHwCqKiqsJ7gIiplZBVUO6+FbVwUdO+oqZWxRsGS5xwAFqbWPGSngkfSadgbUvHsmolzyfAeKl4mDfly6aY7kHL1DHxE3dLY2zVVEFPF3ksjWMHUl2AFht74m6Sthe39oire0fUp/b38iR0Whb9qG9agnc+6V9RO07iMnEbfc0bLp0dmulweI7dQT1Tz9mNnNj9F0NPw9VXzkS5+hzN3xLdbv+Ghx9TZ9547xxBzbXYyXDo6eQY+Q3WMVnHnVD9obfQQDzAcfzXWpOEusrhgvpIqZh/4sgDh8Fdqfs/XWUZqb7Tx+jYT/AIqWqtEp7tP+SG7Ncve6bLDLxx1tzZbNRgeXchdyh4/anhHLUW631Dh4+038Ar2Oz3KGY/b4z/8AR/zVruXZ6vTf/ZL5SSeTXxFv6r362hz4UUZVWtw/qZd7X2iIdhcrE8HPtOp5BgfNZ1pvi/om8vbGLoKSV2NqlpjGfIE7LQ954Ma6tsbnihjq429O4k5nH4LArrbLjapTHX0E9NI3qJGFqxLSNMyl+TLZ/Y2w1XVMV/nRbRPKjqoKhjZIJmSMcMgtOQR5rsZyoIaX1lqXTVQ2ay3WppmA5dCH80bve07Fb64f8fbdWd3RapiFFUHb6TGP3Tj6j7P5KlzfhzIxl1Q9y+xeYOv0ZD6Z+1/c3qi6dDWQXCnjqqOdk0DwC17HZDgu4qFpp7MvFJNboIqH3oFg9boqiIgCIiAIiIAip4qqAIiIAiIgCKhQnHigB6IT7kJ2WveK+vf9nYm261Bs92nb7LAObux5kePoFvx8ezIsUILdkXMzK8Sp22PZGwQdvP3Ko6brHtBS3yTStFLqBrRcSzmlA6gHoD64wr9z42ytdkOibj9DdVZ6kFL68n0XB5IP47L4U1bT1L3sgqIpTGeV4Y7JB9V9gQ/O/TZeJRa78HuMlLlcoj92g6jUcd+jgq5nm0SszTsaMMLvtcw8SNtz0zt4rEdHaYvGpqjkt9O8sGz5n5DAPDJ+akxqjTtq1DQiiu0BmhDw8b4Ix5EdFjmqtbaM4eW1tPJJEyRrf3VHTNBkOPTw95XTYmsWLHjRjw9/2ORzNDhLKlffP2lu0nwlsVt5Zrs51yqRvh+0bT6N8fjlZJedT6P0jSBtfcrfboWbCMYGPgFGnXfHHVmoJpIbXKLNQEHlbDh0jh6vI/ID3rUdzkqq+rD5pJ6iokOcyOL3O+JOVKjo+RlfmZVn7Hpani4r9PFr/cllfu0hoO384oxXXBzfGOLlYfiSsLre1jRscfoukJ3jzfWD/pWk7Vw71tfYg+1aZuE8ZPUs5cf2iFkNJ2cOJ1azm+iWul/hqKstP4MP5rXZp2n472sl/clV52Zb8q2M5/8AS3lbJ7WjmcufCr3/ABCuVv7XFkMobcdK1sLT1dFUh+Phyha3PZc4mkEh9iz5fTX/AP61Yr92deKlubltmhuHk2inDz+Iaorp0+W6i1wTY2ZceZJkpNL9ojhnfXMiN3dbpnHAbWRcmT6HK2HPDp3VNtzJFQXWkkbscNkbv+S81dRaY1Hp2Qw3izVtC9nXvojyj/vdPxX20frnVekalk+nb3V0Jac9213NEfex2Wn5LVLTI/NVPk9/it/bbHcmdrzgBZq2OWr0zUOt9QdxBIeaI+m+4+ePRR51bpa/aWuLqO9UEkLh9VxGWPHmPRbV4QdqShuDobXr2mjoKgnlbcIMmFx83t3LfeMj08RIS6W+wausHJURUtxoJ4+aORpDgfVrvD4KTi6zl4M1G/3RK/K0XHyk5U8MiRw04nXzQ0wbBJ9JtriDJSSEkDzLfu/BSv0HrSz6ztLa+01DTjAlid9eN3kR+qjDxo4TXHR0r7nbGyVtmLsl+Mvgz4OHl6/gsM0Lqi76Pvkd1tM/K9h/exO+pK3ycPEfl4KzzNPx9Uh62O/cVmJn36bJU3fKT3HkVyWL8PNZW3WmnorpbXgOI5ZoXH2on+LT/j4rJx0XETrlVNwn3R2VdkbIqcfJVFRVXnc2BAiIAiIgKeOVVEQBERAEVFVAUdjG6+by3OSCuUhw3w+K0ZrPjFd/9pJ7TpG1CuZSl3eyljpOfHXAb0HqpGNi2ZLah47kPMzasVJ2eeyN0XmonpbRVVNLTuqJ4oXvjiB3e4AkD4la44Y6LrH3GbVmqoue51EhfHE/fuvL/Xgrjwj4jQ62p5qaem+i3GmAMkQOWkZwSPd6rPzsw/ot/q3YSnT2b7v7GhU058q72+qK7L7nB2GEuOAB1Ks9PebZfIbhS224sMsGYpJGD+jOOqsvFS/TUlpbZ7cHOudxPcwtb1wdifRd3R+jKGw6b/ZrHOkknZ/vM3N7T3Eb7+S1wojClTsfPj/UxLIssulVSt4ru3/gxXgrbvot3v09HPNUUHeNjZPId5pG553Y8slbQMjYmlzy0NaMlx2GF0rNa6Kx2+OgoYxDTxt2Hn4kkqMnae43Pmnn0ZpGpwxmWXCsjd1d/wANh9PE/wCC3yjZqGR1L7fwZx64afj9JkPHbj5Db5ZdO6MkZLWDLaiu6tiP3WD7TvXoPXwjmK2tu1eZJpp62snf9ol73uPhtuT+Ct+jNP3jVl8gtFlppKqrlduB0jb4ucfADz9VNLg7wdsWh6OKrqmx3G8Fv7yoe32YvRg8PeuhjkY+kQ6a1vIqJ412pS6nxE1Nw54D369NjrtRym00bsFsQaHTPHu6N+Z9y3zo/hlozTMfNQ2eB8wwTPUgSSE+ZJ2Hwwssq6ulpIxJUTxU7C4NBkeGgk7Ab+awviRqm9Westtrs9JA6e5PMcVRM7DGu8BjxPxVJfn5mpT6d9l9OyLCGJiadDq6d2ZyGsA5WtGwxgfoupe7tbrNRGrulSymgBALnnYZWs7FcNS6a17SW/U93ZWw3RhALdmRSZ2aPHrsrvx8o6yu0S2KhoZq2T6TG4xRNyXDm3+Cj/glC+EJS4flf/TbHUHOic647SXguY4l6JEjY232nc4kAANd4/BZe3Dt9iFHbUVBcr7DRw2vh5PbO6nY984LQSMjqFImMYbjGCfBetQxasdR6N93vvu0/wDB503MuyHN2duNuNjq3O22+5U7qWvooKuA7GOaMPafgQVpHil2ZtH6jpparTZdYbicuHd5fA8+TmE5HwO3kts3K+TRX4UNKKZ4jj55WySljsnyyMH5rtW6/U9TUNpJoailqiMiKVn1vUOGQR8VHh69W04smTtpnLokec3Enh1qnh9c/od/oHsjecRVMXtQy+5wHX0OPisi4K8bNRcOa+KDmfcbG8gT0crt2t+9GejSPLx6bdRPjVGnrNqW0TWq90MVZRzt5XxvGceoPUH1UFe0VwVuXDu6OudtZLWacnfiKbq6Bx6Mf/1dFaU5leUvSsXJpnTOl9dfYm1o/UuntfaXiuVqljraGqZiRjgCW5G7XDwUbuPvDJ2ka43qzxF9mqHYLMZNO4+H8vktQcCOKlx4aakjqB3lTaJ3NFbSB2PZJ3c3+If5eqnpFLYdc6Qa+J0VwtVxp/rAfWaR+BCUX26TkJr5X3NGVjV6lS017kQ/4Sa3rdE6rhro3vdb5CG1cOdnRn7Q9QptWyvprjQQVtJKyaGeMSRvYcgtPQqEWudB3yxa6qNN0NBU1r+bmpXRMJ72M7gnbAPgd8A53UneAendS6b0W236iljLhIXwQNfzOhYd+Unp1zsMj1Uz4grxrq45NbXU/wCSv0OeRVKVM+yNkg9FULjg4G65LlO+zOpZVUJwqqjui9I8vsVREWDIREQBERAUJ3RFQnG5OFjyEda71lNb7ZUVlXK2KCGNz5Hu+yADlRC0lryTR2qblcqCjZWRVXeMayY8paC7IO2fJba7U2qTQ2Cn03TSYmr3GScD/hM3wfLJwfXBVv7MujYJKGo1RcaZshm/dUrXtzhoILn/AB2HzXR4EK8XEldYt+rjY5LUpW5ufCmh7OPO/wBDn2b9P3Y3m46troDTU9VGWRNILeclwdsPIYW+AMjfxXyijaxgY1uGg7AL7EYVNmZbyrOtr7f2Og0/Cjh0KqPfu/1MYOl2za3dqOrqXTFkQjp4cezFtuc+JWTtIDRlUG56K06wvtFprTVwvdwl7unpIXSOPuHQLV6krWk/HBvrphTu155Zprta8UzpKxDTdnqOW8XKL2nsO8EJ2z/MTnHood6Rs121Lqakslqp5amsrZA0DrjzcT5DO5K+mu9R3LV+rrhf7hIXz1k5cxuciNvRjR6AADCmJ2UOFcWktKx6mulPi93OMODXdaeE7tZ6E/WPvAXQpx0/H3/qZWtSy7f/ABM34NcNLTw703HS0rI5rlMAayrI3e77rf4R4D4+iuvEDV9v0nazJM5s1bL7FPSsOXvd4beXqVc9W3qj07Yp7pXStbHCPZbnBe7waPUrV8dZTcQ4YLzRRxUeqbQ8vbTyHd7D9kg9QRjfwJ9VWYtUsifrXb9O/P8Av6Gc7KWPB1U/N/v+Sltuc98uFHZOI1FLSmpnbV214dytJGcRuPx6LPeIGl36jsVPTUUzaWqpZo5qWYnPdlrh+mViFoo9R621NRXW8UZtVstUofHC5m75G+O/h69FtYENa4lxb5krZm3elbCVeyl32T4X6ft3NWBV61Nkbfl7btctfcwjTPDqloa+O73msqLxcmO5myzO9ljvAgeizgAcoDQPf5LX2uuKdk0+ZKWjIuVa3Ysjd7DT/E79BkrSeqOMGtLjJIyGtbboXHLW07cOH/eW+nSs7UH1z4Xjf/Qj3atgacuiHL87d/7krzyjyVG8pGN+mM+KgldtWajrJS+qvlfK7OcumP6LrUuu9X24n6FqK5U+/wBiXqpcvha1LdzTZrq+Jq5PZQaRPCtoaKsjeyohY5rhhxIwfmuUFJBCyNjIxiNoa3I3A96h/pPtE6ztEzY7y2C7UowCH+zKB583ipGcLeKelNeQFtrrGw1wGZKKY8so9QPtD1CqMvTcnFXu5X2LjHzMfJe8e5nbhtsBt0XQvdmt96tVRbLpTR1NLURmOSN4yC0/66q4/FCR0/JVvU1zHuiwaTWzPN7tB8OarhxriS3tDpbZU5lopiOrSfqn+IeK2j2KuJrrZff9g7pVf7pXO5qEvdsyX7g/m8vPCkB2j+HkXEDhzW0cUIddKRhqKF3Q940Z5c/xfV+K89aCoq7XdI6qmfJBV0kwfG8bOje05BHkV0GPP8XQ1J8lbZH0ZppHqBqB7qOgqLjDSRSVMTTyuLQDjx3/AEWCad1JXnUsc9bUl8Ux5XAbNb5YWQ8JdV02vOHNsv7eTnq4cVEYOQyYbSN+DshYPd6GS23appMECKQ92T15TuPwXjTKq7IzpmvcV2tzuqnC6t+03Ux2WNI6Fc1ZtJV4uNipqgn2uXlcPIjb9FeVS2Qdc3F+C+osVtUZryFQqqoV5RtZVEVCgKoh+qiAIiICmFxkALck4A3XI7K16qrW27TlwrXHAgp3vB9Q0kLMYuUlH68HiyfRFy+i3Ip8Ya+TVfFWpp6dxcBMyhgHkc4B+bvwUqtIWqGyacobXAwNZTwtZj1xv+KiZwSpjfOL1vdM3njbNJVvPlgEg/2i1TGZsMDwV7rc/TjXjrwjm9Ardkrcl+WVb4+9c1xHUrl0VD5Onb5KYUYO3Tq99JZ7Zo6llc19YTVVLWncsacM+GQVJSprqKBxZNVQxuA3DngH8V57dpjUL9Q8ar/OHkw0lR9Cj/h7r2HfNwcfirLTMd2XbvwRMyxqvZeTv9l/RbNbcTaZlVEX2+24qqnI2O/stPvIPyXoAxjY2NY1gawDAHktCdiPSrbVw1k1FLERUXidzmkjcRMPI0fNrj8Vv4gdCM+CxqWQ7rmvoMSrorRh2p6ex68t1x0/DXD6TQytLnMdvDJglp/NYLpnTNdfNRRyVk0dPcbFO2OWtpZATPHg4aQPHp18CVfdZ8Opo7i/UGjKs2u7nLnsYcRzZ65WScNNPSae0yymq3MdXzvM1W9pzzPcd91vjfCjG/Knvv48p+f2K10TyMterDbbz4a8fuZHkMhzJgNAy4k9Mev4rRvFPiU64zy2GwzltK0lk07Dh0hHg0/d9Vd+0nreSw2Vlht03JW14Ie5p3ji+0PjsPmo72yr5COYnBG5J8vNWehaSrE77e3grNf1aVTVFX7l7qIiQXEuOTnJO2fUqxXWPlKyGGdszBG7LnOPKNsku8AAthaQ4K1d5a2t1DPJR07txC3+kPv8l0d+bThx3skczRhXZr2rRH2rG53VqqM4Km7Q8GeH1NFyusTKhxG7pnGQn13Vm1RwB0LdYX/Q6aa2T/Zkgk2B/lOyqv8AmXFnLZpov6/hzJrjvumQqqHHcL52+vrLXXRV9DUy09RC7mZJE4tc0+YK2Fxh4VX/AEBUiapH0u2SOxDVxtPKD91w8D+a1hUPz6ZGceSmq6q+veD3TMRqspns1syanZy4zwa4g/YN8kiiv9PHlrs+zVMGxcD94ZGR6+9buHgfzXl1ZLzX2C+0d6tc7oK2jmbLC8eYPQ+hGQfRejnCjVdNrbQ1t1DTneeICVud2SD6wK43VMJVT64LZHU4N/XHaT3ZlRGWrzw7U2lW6T4u3KOCLu6Wvcaun2wPa3cPgV6IeCiV/wCUAtDOTTl9A9vnkpHH+Egv/Ra9Ot9O79Tblw6oFOwLqZ5F90nNK7kZy1kHMdhn2XAe87rd/FCn7u509Q1uBMzld7x/lhRB7HdwfQcc7UwP5YquKWF/qS32fxU1uJlM2W0wTH+qk/NTVtRnp/Urs6Pr4Evt/wCjqcKqjmpaqjLvqPEgHoRj8wVnQ6LW3DeXu71LF9+LPyP+a2SFC1SHRkv7m7Rp9WLFfTgquLui5KhUBFo+xVERYMhERAEREBQrBeO9SaXhXe5GuILogwEHzcAs6d0Wu+0T/wDCi7endn/nCkYa3yK/1Imc9saf6M1B2TqMHWlxrHNbyxW9zQT0aS9h/ulbUvvGvRdouT6CSoqKhzHcsr4Yi5rfcfFak4Cvndp3WYoQ/wClC3ER8n1vqu6evkujwqn4djSt5i1fGTdHNdymUnnIwcd35Oz1/wD6ukzMSvIyLJz3e23C7nKYedbjYlcK9lvvy+xJ/SuobXqS1x3S01YmppDgeBBHUEeBCxXtA62qdB8M6++UDWuriWwUxduGyPPKHEeQzn4LCOyZFUMgvrmNc2hdKzkzsCd+nr5rNe0RpB+tOF1ztUEnJUsAqIM9C9h5gD6HGPiqO6iFOWq/G6/2zpsLIlkYysZEHSXC7iDxboK3V7q9tSWPcI5q+cufM9pPstJ6AdFqyshqm3OakrmSMqxOY52yHLhJnDgfXOVsHhXxa17pGy1enNM8lVT1BJjY6AyGnc7q9mOnxyMrAI3z1F3jqamWSWaSoD5HyHLnPLslxPic5V7DrjKa428EObg0tu+56V8JrY2z8NNN29ox3Vtg5vVxYC4/MlZTgeXTorXpVzX6ZtTmY5TRxFuPLkGFdFyk23N7l1FJRQLWnqAuDmsaMhrR13wvouhqCY09jrpxnMdPI/b0aSsRinJGZPaJCvi9qN+oOIl1rC8mKOUwwb/YbsP1WMwz56HJVtrqhz7hVSk7ulcfxK4w1GCObp4r6liqMKIRX0Pl+XXKy6cvuSM7Mulo7vWSamuEQkhpX8tKHDZ8mN3fD81I0DfAG2FgPZ9pIqXhNYnMAzUU7Z3Y+8/c/mtg7dF881XJd+VNvsuDvdJxFRiwS79w0YACYGc43RVVeWha9UWW3X+yVVpudOyelqIyx7XDPXx9687+Lel59E67uOnpcmOF/NA4/ajI9k/p8CvSF25UPO3hQQU+rdPXRrAJaukmhcfEiNzSP/yFW+kZMoWuv6ldqNClX1Ija/G+Sfd5qVvYP1O6SO+6VllyI+Wtp4z4NzyvPvyWKJr37lvn4reXYfmezjLM0E4mtkrT7uZp/QK01BKVLRBw/bYidI3b5KPnbmoop+FVNUyY56atjczb7x5T+BUg27BR07eFybS8N7ZQHDnVlfy+4NbzZ/Bc7gre+Bc3vaDIy9nqc0/GjShaSOa5xNOPLmGy9AeIntacfgf1rVAbsz0D7lxw01GBnu6xtQR5Bh5ip+a8A/YPI4jJlbsrO/nMrK2X/ZWfozEtARuGpY3HOO7cPyWzwteaEGb9sPqxu/RbDb0UXVZdV/7DRY9ND/UqiKhVai3fYqiIhkIiIAiIgOLlgXaAhM3Ci9taCXNja/b0e1Z8VYtfUQuOjbtRkZMlLIAMeIGR+S3Y0+m6D+5Hy49VEo/ZkfuyO7/1uu9O7GJKEPwR917R/eX37TmjrTYprff7XRspPpkro6nk6PkI5gcdAcB3RYt2drq608WKOmc4NbVxy0ryfMDn/NgC3r2i7E+/cMa90UYdUUBbVw79OX6x/sFy6LItli6lGe/D2OVxKY5WlShtzHc6PZhuMFZw9bTsDBLTVD2P5RjY7jPrgFbQuFOyppJYH5LZGFrvXZRj7JV/+harrbFK9wjro+eIHxewf4ZUpPH0VRqcHXlSfh8ovdGtVmJGPlcMg92VYJNO8favTVQAMxVFPLnwdHnA9+VqbixQGycStRWyJhjbTXOobED9wSO5D8sFbY4yiXhz2o4b/FDMKeatjuIEf9cHkF7R4/WJHRdftp6afauKovzIsQXamZLkNwA9g5HD3nlz8VZ1TXrR6XxJGLovp/QljwEvDL3wg0zXteHkW+OF7h4ujHdu/FpWdqL/AGEtXsqtO3TRs0v76hm+kUrCf6p/Vo9Q4OJ94UnmHI653VFlVuu6USxol1VpnJdW7Q/SLXVQf8WJzPmMLtLjIOZhHuWmL2e5skt1sebl5Y+lu9bTyZDo53sI9Q4rpGZwGxWf9prT0mmeKdeGxltLXn6TAcYG/UfA/mtZiXfbOV9FxMhW0xcThcnGddskydHZavMd14R22JrwZKIup3NzkjlOB8xutrYGVBjs7cUo9A6kdTXJzhZa8gT437lw6P8AcFNu2V9NcqKOsop456eVodHIx4LXDzB8lxeq4k6L5ykuGdXp16sqUd+UdzdFQdNt1TnOfqlVm6LDYq7r16KFHbtvkdbxFtNnifz/ALOoS9/o6R24+TB81LnXWqbXpHS9bf7tM2KmpY+Y56vd9lo8yV5ucQtTVOr9YXHUVWT3lZKXAE/VZ9lvwCtdKq3t9T6EHMn0x2LA7cE/j5KQnYQoJKjilcq7kPdU1sfl/hzOewAfEZPwUeS4Zwen5qb/AGItHPsfD2p1DVxd3U3qUPYCN+6YCGn45PyVhqM1Gp89yHiQcpkhSNlCrt5agFZrO06fhky2hgMszfJ7+n/KVMPUV4orDZau73OZsFHSROllkccBrWjJ/JeaPEzVNRrXXFz1HUAtNZM50bXH6kf2Gn3BVmmVdVnqPsidmS6Y7I232GLGa/ijV3h8ZEVso3EPxs5zyW4+HVS24jSn6PTQA7ueS73LXXY40W7THCyK5VcRZW3p/wBMfn7MZ/o/dluDjzWZaqqfpd4cAeaOIcg9Tndb4S9TK6/ESJmezE6V3kd7h5RkSVNW7zDB+f6rM27BWzTlH9DtMUZGHkcztvEq5joq/Ks9S5sl4FPpURRVUVUUcmBERAEREAREQFCvlURtfE5jyOVzSD8V9SuD8YIIWO3P0MPnh+SE2qY5NGcXJXMaWCguDZwPNhdk/AgkKZVK6nu1obI4Nlp6qAEt6gtc3cfjhae48aC05W32DU961HBZqYxd1OC0ufMQduUDckeiyjhlrnQktFRaas1/7+amjEUYqWujfJjpjmAB9yvM6x5VNdkE90uTndPpeJdZVJrpb+vJG3U1NX8OuJEn0cuE1vqhLA47d4zOQPcRsph6Pv1HqXTtFeaCRskFTGHtI8CRuD65WnO1fox9ws0OraCImaiHLVco3MZ+18FiXZf18LLdTpi6S8lFWOzTvccNjl8s+AP5rflxWfiRvj8yWzNGJJaZmSofyvsSUuenbLc62CtuVro6uogz3UksIc5gPgCVrLtZaFk1fwwnqKGLvLlaiaqAAbvAHttHvAW4Q9pHMCCF86iMTNdG9uWHYg+I8VRVWyrnGS7o6aUFKO3hnmhwY1pPoTiDbdRMJMEbgyoYD9aJ2Mj9fgvSiyXOiu9opbpb5mz0lXE2aGRnRzXDIUB+1LwsqNBa4luVFADYrnIZ6YtG0Tycvj+ByR6ELOeyJxlFkqodB6kq+WgqHn9n1UjsNieTvGT4A529c+itMupZEPWh+5EomqZOEyZmQqPBIwDgrjC4OGWkFc87qm8k41T2j+Gg19o10lGxn7Yt+ZqQ9Of7zM+o6eoCgfXtmpamWlqI3xTxOLJGPHK5pG2CPNeo0m7COqj32jOArdYtm1HpZsVPfGjMlPs1lWB4Z6B/kTt54V1pepej+XPsVudhq19a7kOHShwOdgT/AKP+Szjhnxd1hoA91aaxs9CetHUZdGPdvkLCL1abrY7lLbbvQVNFVROw6KeMtd79+o9Rsuk5/wCC6CyML47v3IqYKdEuCV1s7XEIhAuWkJGPA3MFYHgnz3aMK2ak7W9wmp5IrBpaGmkcPYnqqnn5T/IAM/2lGAu8fBfJ58RnyVe9Ooi9+klxzLvqTG4VcX9PcW7HUaG4jU1JBcKkFrCDyxVGehaT9R48vx6rQ/HzhDd+G167yNklXY6lx+jVYadv4X+TvwPzWsYZZ4JmzQyujlYcse07tPmPVSk4G8bLRqqzjh7xQZFPHO3uKatn+rJ91sh8HeTv9GPZVPEblWt0/H0JUZxvj0z7kXrWaSK6UktxhfPRsmY6oiY7Dnx8w5mg+oyvSzhRqjS2p9HUVTpSeM0UMbYu4GA+DA2a4eBUNO0DwQuWgah17tAfX6cnfkSsGXUxPRr/ACHk7p542WsNK6t1FpmWpdYLpUUJqIXQTd2dnMcMYx5+OfRebqI5kE4PkVTePL3EhO2dxXju8/8AsHYKxslLA/muMrHey9w6R58QDufctQ9n/QFRxB4i0dqfHJ+y4X99cJPARA7tJ8C7oPesQstsuuor3T222QS1twrZAyNg3c9xO5z+ZOwGSV6EcCOHNBwz0RHSP7p9ymYJK+p6cz8dM/dC8XOOLV0R7s9VqV1nW+yMr1LfLPpLTjqutlZTUsAEbGtHwaAArBpSmp7xUR19LVQ1lEfaE0bwQ8nfp1B9CtD8d9bnVeozR0M2bXQu5Y8dJXeL/d5K18KLrqii1VSUem53mWpkDXROGYyAd8jp0VjVodkMF3dW0ny/0Ofv1qu7OVe26X+SZTfqjZcgvnT84hZ3hHPjfHTK+i5JnYxe6XBVEVCcLBkqiIgCIiAIiIChXF/Lj2j16Kp649FweAQM+HmnHkLvsyKHHGoq9S8c6bTtXVfRqRkkVMwu+rGHHdwB2JPT34XW468O7ZoCK03Gy3ScTyTBpje/LwQCe8B8tgPiFtLjzwlqtXVrb9YHxNukUbWSQSHDZ2gkjB6Bwydz5qO2vNN6vsFXSDV0c4dK0indJMJQGgjO4JxjK6nCsjaoRjLZJco4zPpdEpzshu2+GTD4dVcupeG1qqbvE2R1dRN+kMcMh2Rg594UUeNmjarQeqXxxMeLfUHvaObpjBzj3jyUm+BurrVqfRNI2iYynnoWNhnph/VOxtj0KunEvRds1xpqaz3BpDyMwTgZdDJ9lw/VVeNkvEyJKS9rfYt8nCWVixcXvJLua/7OPFaLVVvi07eahovVLHysc84+ksA+sPN3mPit3AgjZefeo9P6g4eauNLV97SV1K8SU88ZIEgzs9h8lJvgZxnt+rIIrHfpYqW9gcoLjysqceLf4j1x8l7z8HZ+tVymY0/UE/ybeGjYnEjR9r1xpes0/doQ+GdvsOxvG8dHA+BCgLr7hzdeHWpprTd4XOOealqQCGzMz7Lmnz8x4H4L0eYRy5zn1WL8SdFWTXNhfaL1TCRpy6KUfXhf4OafBQcfJlVvF9iwzcZ3Q9j5NBcAuPLaSGn03rSdxhaAymr3HPK3oGyenkfmpQUVRDVQMqKeVksMjQ5j2OBaQemD4qC/E3hZfuH9UX1kMlXai7EVbGzLD/N913p44OFz4b8W9UaKeyGhlFZay7MlHNlzG/yn7K9X1KfugVGNqUsaXpXr9ydhIx1CoQMbrVOg+OOi9RMjhrKxtnrXdYqtwY3Po87E+mcraMVRDNG2SGRkjHjLXNOQR71ElFx7ovasiu1bwkY9rjQmltZUZptQWiCqwPYk5cSM9Wu6haF1f2SbXUyvn01qCakP2YqpnO3+0N/wUoBnrhVyt9eTbV8rPUqIt7tEKZOyXroPwy+WJ7c9S+Uf3VxuHZO1nTWuoqWXi11NTFGXR08TngyOH2cloCmwuL9ztttnK3rUbt+5qeJU+yPKS5UdbbbhNb6+nkp6qB5jlikbyuYR4EL4N5geZuxHQqevaJ4I2vX1DJd7PFDSahiZs8DDKgeDX+vXB8MqC16t1ws11qbVc6aWlrKZ5jlikGHAjz/10Vzh5Svjt58kC6iVT3iSG7PXHiGmpmaG4hubVWecdxDWT+0IgRjkkz1afPwTjh2cK+nrI77w6gNyt9ZI0fRY3ZdEHkAFp6Fm/XwG52BKjaWk7hb+7OHHiq0bJBp3VUstVYHkMjmdlz6XJ/8AB5jwWi7GsrbnT+6NlV1c9o2G++zfwVoeHFtFyuxiqtQVDMPkAy2AeLWn8z4qzcf+JYlEumbBVAsdltXUxuz72NI/ErO+K9Vfb5w9NVoaoiqIqhnM98DuZ0kRG/IR4lRQeJRK/vw5rgSH87eU58Rv4qd8P4NeVb697328FL8Q6jZj1+lStk/J8mgucGN3JOAAOpUoOz9oB2n7O2+3Wn5blVs5msI3hj8B6E9SsQ4CcMjWywarv1PilAD6OF4/pPJ5H3fLz6qRjRhoAT4h1ZSbxqXwu+3+Dz8P6PKP/UXrl9igHmqqqLkDsQqFVRAEREAREQBERAU8coMKqIDg9ueqw/ivouj1xpGotE3KyfHeUs3jFKBsfcQSD6FZkqODcHI6L1Ccq5dUXyeLa43RcJrdEDtN3zUfCvXbpe6kiqIH91WU7tmzNzuD5g+B88KaGidTWzV2nqe9WmcSRStGRn2mnxafIrAu0Bwoh1tQftW2MbFe6Znsu6d8wD6hP4DyUc+Huvb/AMMdTyN7qTuucsrqCTIBxt8HDzV5fCGo1dceJI53Htnptvpy+Rkt+KWgrLr2zuttwi7upaCaaqYPbgd5g+Xp0KhhxD0VqHh9e/otzic0B3PT1UZPI8A/WDvA+nUKb2gtYWXWVjju1nqmyxuHtR59uI+IcPNdrVmnbNqizSWu90cVXSyb4eN2nwLT1B9VCxs2zFl6c+xY5OBVkpWQ4ZG7gz2hamiEVo1u99RTjDI68bvaPDn+97+vmpOWS62670DK221kNXBI3ma+J4cCFEXivwBvmmTPcdOd5dbaMu7sbzRN8iPEeq1xoXW2qtEXJ1RZLjPSkO/eUsm8Tj48zTt4deql24VOUuul8/QiV512G/TvXB6DXOkpa+ikpa2njqaeVvK+ORgc1w8iCtB8Quzlb6p8tw0fUNoJXZd9Dl3hz5NP2fyX00F2lbHcO6pNU0j7ZUbAzxjmicfPzC3dZL9Z7zStqrXcqarieMtdG8HKrZV30PlFhL8LnQ2ez3/uQL1nozVulKl0N7s1VTR5w2YN5one5w2Xy03qrU2myBZr1X0Lc55IpSGH3gbH4r0HmiiqIjHNG17HdWuaCCPUFYLqjg9w+v5e+o09TU8rs5kpP3Bz5nkxlefxG/zorLdEnB70y2I2W3tD8QqJzGTVNJXNbt++haD82jKyWm7TupWM/f6etkh82uf/AIrK7r2XtNyuc+2326UmfsOLXtHzGfxVnqezBU9INTx4/jpz+hWFKDNbq1Gl+17lqqe1HqR3sRabtzD5lz/8VZrp2iNfVbT9HfRUAcP6uEOx8XZWU03Zbqu9zPqmLkz/AFdOc/iVfbd2YdPscHV1/uc3mIg1oP4ZTeCDq1G3u9jTNm4x6+t+pYLvUX2qr4mnElLLIe6e09Ry9AfVbj4kaD09x30DDq7TjI6S/wAUZYx5aGl5buYnnxxnY+GfUrObBwO4c2otebK2te3G9XIZQSP4XZH4LYtDQ0tBTMpqKlhp4WDDY4mBrQPQBFd0S6qyfhY19a2ue55Z3y0XKx3WotN2pJaWrpnlkkcjcEH9V0nEgADY+BHgvQHtD8GLbxGtJrKFkdLqGmYfo8/1RMOvdvx1HkfD5qBmoLRcrDeam03alkpauneWSRSNwW4/RdBiZUchbPua76JVy+xtPs8ca7nw6rm2y5mSt0/M797AdzT+b2fqPH3qWEeidCa8uNDrWj7urp5v3rmRYMVQT0c8efn5+K87T+HiFsvgVxevPDS84aX1dmmkzVUZOxz9pv3Xe5ebqLK97KH0y7P7ozCVdzUbo7o9FGMDG8jQAGjZfRvQZWPaI1ZZdZWGnvNhrWVNLO3OQfaYfFrh4EdCFkLfqjxXNyi4vZouY9tl2KoiLBkIiIAiIgCIiAIiIAiIgCoQqogOJAwcjIWoeOfB2i1vSvuVrLKO+MZtJjDKj0f5+9bfIyMLiGADG6203Tpl1QZpvorvj0TXBAWx3XWHCzVjxC2ahrI3ck9NK3MczR4EdHA+Y39VKjhTxm05rWKOmlljtt3wOamlfs/1Y7x+PT1WR8SuHmndd2w0l3pcTgHuauI8ssR8CD4j0OQogcSuEmq9B1JqXsfV29r+aKtpgRy+RIG7T6q366M5bS4kUnRkae/a94E6wWv6AH3rXnETg7o3WgknqKAUNwdk/TKPEb3HzcOjviCo8cM+0FqTTDY6C+g3y3t2BkdieMej/tfEE+qkroXipozWELXWy7RR1BG9POe7lB8sHY/AqDZjX4st1/BY1ZNGXHbb9mRi112d9a2CaSe0NivVG3dphbyygerfH3gj3LWBqL7pq4kRyXC0VLHYPI58BJ9cYyvSFpa8c4ydvNWrUOldO6ii7u9Wahrhy8odNCHPA8g7qPgVtjqUttrFuR7NJhv1VS2ZDbTHaD4iWKJrJq+musTdgK2EOIH8zOVx+JK2HYO1UH4ZedKkectPUYHwaQT+KzPU/Zq0Bc+d9tdcLO89G00/MzPqHhx+RC1veOyvfYA51q1LR1bfsxzU5iPxcHH8lt68S1c8GlV5uPwuTZFt7SnD6pAbMy607/EPpgWj45WW6O4taK1beGWiy3Qy1kjHPbE9nKSAMlRer+zvxMpebkorfUtHQRVPX5tCzPs2cMNa6a4ox3S/2V9JSxU0jWyuc0gktxjZabqMeMN4SNuPlZjl0zjx+hJLVOpbRpi0yXa91sVJSM6ucdyfAAeJK1cztKcP31ogLbo2Iu5e/NMA0evXp6rXPbXr6x+qrNZnyuZQNpO/DRnl53Pc0k+ewHuwu9qbgpoa38Ef27T1kxuEVE2qFaZ8tkcQDy46cu5xjfpuUpxqvTTs89jZdlXuxxglwST09d7dfrTBdbXWMqqOcc0csZ9lyuIwT7lGrsS3Stkor/Z3ve+igdFNETuA54cHD/kapKjbP4qHfV6M3Em4t7vrUmDgDHn6LUPaG4NWziRaHVtII6TUNOz/AHaoxgSgdI5PTwB8CfgtvuaHDBz80wF4rslXLqibpRU1szyt1FZLpp681FovFJJSVlO4skjkGCD6efvXQAAGMeGF6j3fSWmLvV/S7pp6010+OXvKijjkdjwGXNJXU/8AN/of/shYP/tsP/SreGrJbdUdyBLA3fDPP3g1xOvfDfUP062y99QyECronOwyZvTPo8DbI+OQp/8ADjXFi17pyG+WGrbLC8DvIyRzxHxa4eBB2VRw90L/ANj9P9c/+7Yev9lXSy6dsVlY9lotFBQCQ5eKanZFz+/lAz8VDysmu97xjsyVTW61s2XJpy1clRoDWgBVUDybwiIsgIiIAiIgCIiAIiIAiIgCIiApjdfGpp4amF8NREyaN4w9j2ghw9QV91TdN9jDSfdGi+JnZ20zqF8tdp6Q2auO5Y1vPA8+rcgj4HHoo66y4X640TUumrLXM6KJ2WVtGS9nvyPaHyU/cHdcJYY5WFkjWuaRggjIKnU6hZUtnyiuv02q17x9rII6N438QdLllPFdPp1Mw4MFcwyAD+bZ3zK3LpTtQ2idsbNS2Gpo3dDLTPErT68p5SB81szWXBzQep+eSqs0dNO7+upT3bs/Ij8Fp/VXZalHPJpzUrCT9WGtjLR7i9uf/CpKtxb/AJ1syN6ObR8j3X8m37Fxj4dXpgFNqOmieerJw6Mj5jH4rL7fe7RXtBo7nR1GendTtdn5FQhvvAbiZapHNNibcI2795STtc34cxDj8li8+ntb2KQl1ov9FyndzYpGD5jZeHgUz+SRmOoZEOJwPRbLSAQdkyBtsF51xa51vbCI4dQ3alI+y+U/3lcYOLXEiIbawuB97mH+6sf8Ml2TR6WrR7tMlj2guFreItlhko52Ut3oyTTSP+o9p6sdjw9VHY8JOLklIyw1Ymht0bgMz14FOB6b9PgsUreLHECpbyT6uuJJ6hrm7/IK0zXfWF7yPpt5rM9Qx8js/AKXTj2Vx6HJbEO/IqulwmTa4EaDoNCaPFNT1cddVVTzNV1Ue7Xv6Yb/AAjGPmtiAePgtE9kCu1DHpKtsV8tlxpo6SfvKaWqhezma8btHNucODj8Qt7M6e9U+Rv6jTe5e43T6ScVsclRVRaTeEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAAqOAKqqICmMjC+c0EUreV8TXt8nDK+qqm7XZmHFPui3S2a0y/0lqonHzdA0/ous7S2n39bLbx7qdv8AgrzhPmvSnNeTy64v+lFmj0tp5jg5tmoMj/5dv+C7kVqt0J/c2+lZ/LE0fou78CnzWXOb8hVpf0nBrOXAAwB0A2XMIqrwewiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiA//2Q==";

function LogoBadge() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-5 pointer-events-none z-50">
      <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-md border border-slate-200/70 rounded-2xl px-4 py-2 shadow-lg shadow-slate-900/5">
        <img src={LOGO_SRC} alt="ReceiptGen logo" className="w-6 h-6 rounded-md object-contain" />
        <div className="flex flex-col leading-none">
          <span className="text-[8px] font-semibold tracking-[0.18em] uppercase text-slate-400">Powered by</span>
          <span className="text-[11px] font-black tracking-tight text-slate-700">ReceiptGen</span>
        </div>
        <div className="w-px h-5 bg-slate-200 mx-0.5" />
        <span className="text-[8px] font-medium text-slate-400 tracking-wide">Professional Edition</span>
      </div>
    </div>
  );
}

export default function ProfileSetup() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function checkUserSession() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (!user) { router.push('/login'); return; }
        const { data: profileData } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
        if (profileData) { router.push('/receipt'); } else { setLoading(false); }
      } catch (err) {
        console.error(err.message);
        setLoading(false);
      }
    }
    checkUserSession();
  }, [router]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!businessName.trim() || !phoneNumber.trim() || !shopAddress.trim()) {
      setMessage('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { error } = await supabase.from('profiles').insert([{
        id: user.id,
        business_name: businessName,
        phone_number: phoneNumber,
        shop_address: shopAddress,
        user_id: user.id
      }]);

      if (error) throw error;
      router.push('/receipt');
    } catch (err) {
      setMessage(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <p className="text-sm font-medium text-slate-500 tracking-wide">Checking your profile…</p>
        </div>
        <LogoBadge />
      </div>
    );
  }

  const fields = [
    { id: 'businessName', label: 'Business Name', placeholder: 'e.g. HaQQ Computers', icon: Store, value: businessName, onChange: setBusinessName, multiline: false },
    { id: 'phoneNumber',  label: 'Phone Number',  placeholder: 'e.g. 08012345678',     icon: Phone, value: phoneNumber,  onChange: setPhoneNumber,  multiline: false },
    { id: 'shopAddress',  label: 'Shop Address',  placeholder: 'e.g. Shop 4, Lagos Road', icon: MapPin, value: shopAddress, onChange: setShopAddress, multiline: true },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 pb-24"
         style={{ animation: 'fadeIn 0.4s ease both' }}>

      <div className="fixed inset-0 bg-[linear-gradient(to_right,#e2e8f020_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f020_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative w-full max-w-md" style={{ animation: 'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/8 border border-slate-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />
          <div className="p-8">

            {/* Header */}
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30 mb-4">
                <Store size={26} className="text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Set up your business</h2>
              <p className="text-sm text-slate-500 mt-1.5">This appears on every receipt — you only do this once.</p>
            </div>

            {/* Error */}
            {message && (
              <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 mb-5">
                <span>⚠</span><span className="font-medium">{message}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {fields.map(({ id, label, placeholder, icon: Icon, value, onChange, multiline }) => (
                <div key={id} className="group">
                  <label htmlFor={id} className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    {label}
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3.5 ${multiline ? 'top-3.5' : 'top-1/2 -translate-y-1/2'} text-slate-300 group-focus-within:text-blue-500 transition-colors duration-200 pointer-events-none`}>
                      <Icon size={15} />
                    </span>
                    {multiline ? (
                      <textarea id={id} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} rows={2}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 resize-none" />
                    ) : (
                      <input id={id} type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200" />
                    )}
                  </div>
                </div>
              ))}

              <button type="submit"
                className="group w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 active:scale-[0.98] text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 text-sm shadow-md shadow-slate-900/15 mt-1">
                <span>Save & Continue</span>
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <LogoBadge />

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
      `}</style>
    </div>
  );
}