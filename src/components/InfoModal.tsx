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
        'Հեռացված խաղացողները ցուցադրվում են նվազեցված թափանցիկությամբ',
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 border border-gray-700/50 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gray-900/95 border-b border-gray-700/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Խաղի տեղեկություններ</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors touch-manipulation"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                  {section.icon}
                </div>
                <h3 className="text-base font-semibold text-white">{section.title}</h3>
              </div>
              <div className="ml-11 space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 leading-relaxed text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-gray-900/95 border-t border-gray-700/50 p-4">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm touch-manipulation"
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