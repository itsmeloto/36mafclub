import React from 'react';
import { X, Info, Users, Vote, AlertTriangle, UserX, Clock, Gamepad2, Hammer } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    {
      icon: <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: 'Խաղի ընդհանուր նկարագրություն',
      items: [
        'Սա սոցիալական հետաքննական խաղ է, որտեղ խաղացողներին տրվում են դերեր',
        'Մաֆիայի թիմի նպատակն է վերացնել քաղաքացիներին (այպես որ մաֆիայի և քաղաքացիների միջև քանակը հավասար դառնա)',
        'Կարմիրների թիմի նպատակն է գտնել և վերացնել բոլոր մաֆիաներին',
      ]
    },
    {
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: 'Խաղացողների կարգավորում',
      items: [
        'Կարմիր խաղացողներ: Քաղաքացիական թիմի անդամներ (Շերիֆ, Քաղաքացիներ)',
        'Սև խաղացողներ: Մաֆիայի թիմի անդամներ (Դոն, Մաֆիա)',
        'Խորհուրդ տրվող քանակը խաղը սկսելու համար 6-7 խաղացողն է'
      ]
    },
    {
      icon: <Vote className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: 'Քվեարկության համակարգ',
      items: [
        'Սեղմեք խաղացողի քարտի վրա՝ նրան քվեարկության դնելու համար',
        'Քվեարկության տակ գտնվող խաղացողները ընդգծվում են կարմիր եզրագծով',
        'Քվեարկությունը հեռացնելու համար կրկին սեղմեք նրա քարտի վրա'
      ]
    },
    {
      icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: 'Նախազգուշացումների համակարգ',
      items: [
        'Խաղացողները կարող են ստանալ մինչև 3 նախազգուշացում կանոնների խախտման համար',
        '3 նախազգուշացումից հետո խաղացողը հեռացվում է խաղից',
        'Օգտագործեք + և - կոճակները նախազգուշացումներ ավելացնելու կամ հեռացնելու համար',
        'Նախազգուշացումները օգնում են հետևել խաղացողների վարքագծին խաղի ընթացքում'
      ]
    },
    {
      icon: <UserX className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: 'Խաղացողների Հեռացում',
      items: [
        'Սեղմեք X կոճակը խաղացողին խաղից հեռացնելու համար',
        'Հեռացված խաղացողները չեն կարող քվեարկել կամ քվեարկության դրվել',
        'Հեռացված խաղացողները հեռացվում են ակտիվ խաղացողների ցանկից',
        'Օգտագործեք սա այն խաղացողների համար, ովքեր քվեարկվել են կամ վերացվել են գիշերը'
      ]
    },
    {
      icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: 'Ժամանակի կառավարում',
      items: [
        'Ժամանակաչափը միշտ սահմանված է 1 րոպե (60 վայրկյան)',
        'Օգտագործեք Սկսել կոճակը ժամանակաչափը գործարկելու համար',
        'Զրոյացնել կոճակը վերադարձնում է ժամանակաչափը 60 վայրկյանի'
      ]
    },
    {
      icon: <Hammer className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: 'Կայքի Թիմը',
      items: [
        'Տիգրան Տիգրանյան ‒〘Կայքի Ստեղծող〙',
        'YL | Club 36 ‒〘Կայքի Սեփականատեր〙'
      ]
    }
  ];

  return ( 
    <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fade-in-fast">
      {/* Modal container with enhanced glass effect */}
      <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-scale-in">
        
        {/* Header - Sticky with better visual hierarchy */}
        <div className="sticky top-0 bg-gray-900/98 backdrop-blur-sm border-b border-gray-700/50 p-4 sm:p-5 flex items-center justify-between z-10 shadow-lg">
          <div className="flex items-center gap-3">
            {/* Icon with enhanced glow */}
            <div className="p-2.5 bg-blue-500/20 border border-blue-500/30 rounded-lg shadow-lg">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="font-bold text-white armenian-text" 
                style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
              Խաղի տեղեկություններ
            </h2>
          </div>
          {/* Close button with better touch target */}
          <button
            onClick={onClose}
            className="touch-target p-2.5 hover:bg-gray-800/50 rounded-lg smooth-transition focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Փակել"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-200" />
          </button>
        </div>

        {/* Content area with smooth scrolling */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-140px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {sections.map((section, index) => (
            <div key={index} className="space-y-3 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              {/* Section header */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 shadow-md">
                  {section.icon}
                </div>
                <h3 className="font-semibold text-white armenian-text" 
                    style={{ fontSize: 'clamp(0.9375rem, 2.25vw, 1.0625rem)' }}>
                  {section.title}
                </h3>
              </div>
              {/* Section content */}
              <div className="ml-11 space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-200 leading-relaxed armenian-text" 
                       style={{ fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer - Sticky with enhanced button */}
        <div className="sticky bottom-0 bg-gray-900/98 backdrop-blur-sm border-t border-gray-700/50 p-4 sm:p-5 shadow-lg">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="touch-target px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg smooth-transition hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 armenian-text"
              style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
            >
              Հասկացա!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;