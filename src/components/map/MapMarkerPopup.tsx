import { FC } from 'react';
import { Clock, MapPin, User } from 'lucide-react';
import deliveryMan from '../../assets/delivery-man.svg';

interface MapMarkerPopupProps {
  driver: string;
  client: string;
  status: string;
  eta: string;
  color: string;
}

const MapMarkerPopup: FC<MapMarkerPopupProps> = ({ driver, client, status, eta, color }) => {
  return (
    <div className="p-4 min-w-[200px]">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"  width="30px" height="30px" viewBox="0 0 512.000000 512.000000"  preserveAspectRatio="xMidYMid meet">  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none" fill='#ccc'> <path fill="currentColor" d="M2280 4909 c-159 -31 -293 -174 -319 -341 -28 -173 64 -348 227 -429 64 -32 72 -34 177 -34 104 0 114 2 176 32 164 81 261 262 231 430 -42 237 -259 388 -492 342z"/> <path fill="currentColor" d="M1903 4075 c-64 -19 -124 -58 -174 -112 -85 -91 -123 -177 -184 -424 -49 -199 -59 -299 -52 -533 7 -227 20 -307 68 -397 60 -113 127 -148 349 -183 413 -65 607 -96 613 -96 3 0 20 -37 37 -82 169 -438 244 -615 273 -647 65 -69 177 -91 263 -52 56 25 110 92 124 153 20 80 36 30 -221 680 -100 252 -114 280 -152 315 -23 21 -55 44 -72 51 -16 6 -147 30 -290 52 -143 22 -278 43 -299 46 l-39 6 7 117 c4 64 11 148 17 187 l10 71 -98 99 c-154 155 -275 354 -276 455 -2 115 114 208 223 179 59 -16 100 -58 148 -151 24 -46 53 -97 66 -113 l24 -29 7 60 c17 151 -54 304 -162 350 -41 16 -155 16 -210 -2z"/> <path fill="currentColor" d="M1922 3913 c-85 -42 -101 -132 -42 -248 202 -397 560 -625 985 -625 119 0 155 16 185 83 24 52 24 71 1 123 -30 66 -65 80 -211 87 -171 9 -264 37 -397 119 -89 56 -218 196 -273 297 -69 126 -83 145 -120 163 -43 22 -85 22 -128 1z"/> <path fill="currentColor" d="M29 3751 l-29 -29 0 -597 c0 -651 -1 -640 57 -664 21 -8 191 -11 635 -9 l607 3 23 23 23 23 3 608 2 609 -26 31 -26 31 -620 0 -620 0 -29 -29z"/> <path fill="currentColor" d="M3597 3196 c-83 -30 -144 -91 -173 -171 l-11 -30 -94 0 -94 0 -31 83 c-33 89 -54 122 -79 122 -10 0 -15 -10 -15 -30 0 -41 -33 -104 -67 -128 -50 -35 -100 -44 -204 -40 -54 2 -99 0 -99 -5 0 -18 60 -67 82 -67 13 0 66 16 119 34 87 31 97 33 102 18 3 -9 77 -226 165 -482 88 -256 174 -508 192 -560 18 -52 37 -105 42 -118 8 -23 9 -23 65 27 158 141 396 189 606 121 131 -42 256 -132 322 -234 31 -47 84 -23 71 31 -19 77 -163 239 -268 301 -84 50 -191 83 -305 95 l-101 11 -31 81 c-43 112 -95 196 -175 282 -65 69 -181 156 -272 202 -34 17 -45 29 -58 67 -9 26 -16 51 -16 56 0 4 31 8 70 8 l69 0 22 -50 c23 -55 89 -121 141 -143 18 -8 55 -17 81 -21 46 -7 50 -6 82 28 86 91 86 408 0 500 -28 30 -76 34 -138 12z"/> <path fill="currentColor" d="M402 2327 c-20 -21 -22 -34 -22 -146 0 -67 4 -131 10 -141 5 -10 23 -23 40 -28 l30 -11 -21 -53 c-95 -240 -171 -515 -173 -632 l-1 -71 153 -3 153 -3 -7 79 c-9 105 15 222 67 331 77 159 238 288 421 336 96 25 256 17 356 -18 274 -96 454 -378 422 -660 -3 -32 -4 -60 -1 -62 2 -3 329 -5 726 -5 l722 0 -1 110 -1 110 -581 0 -581 0 -26 58 c-39 89 -83 238 -101 341 -21 125 -20 138 10 174 25 30 25 34 22 153 -2 103 -6 125 -22 143 -19 21 -19 21 -796 21 l-777 0 -21 -23z"/> <path fill="currentColor" d="M1063 1895 c-239 -65 -407 -281 -407 -525 0 -154 53 -281 163 -390 178 -176 434 -207 656 -80 247 141 338 468 202 724 -42 79 -146 183 -223 224 -113 59 -274 78 -391 47z m215 -331 c109 -45 162 -173 117 -282 -60 -142 -251 -173 -353 -57 -103 117 -67 275 78 342 36 17 115 15 158 -3z"/> <path fill="currentColor" d="M3778 1894 c-274 -66 -453 -341 -404 -621 34 -194 161 -346 351 -419 60 -24 85 -28 175 -28 116 0 171 13 274 68 163 85 276 275 276 466 0 158 -50 280 -160 390 -74 74 -158 123 -251 145 -78 18 -185 18 -261 -1z m210 -330 c147 -61 178 -261 57 -362 -72 -59 -175 -65 -252 -15 -50 32 -79 75 -94 138 -37 163 133 304 289 239z"/> </g> </svg> 
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: color }}
        />
        <h3 className="font-semibold text-base">{driver}</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <p className="text-sm text-gray-700">{client}</p>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <p className="text-sm text-gray-600">{status}</p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Clock className="w-4 h-4" style={{ color }} />
          <p className="text-sm font-medium" style={{ color }}>
            ETA: {eta}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapMarkerPopup;