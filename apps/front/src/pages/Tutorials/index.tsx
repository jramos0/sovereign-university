import { Link } from 'react-router-dom';

import tutoRabbitPng from '../../assets/tutorial-rabbit.png';
import lightningSvg from '../../assets/tutorials/lightning.svg';
import merchantSvg from '../../assets/tutorials/merchant.svg';
import miningSvg from '../../assets/tutorials/mining.svg';
import nodeSvg from '../../assets/tutorials/node.svg';
import walletSvg from '../../assets/tutorials/wallet.svg';
import { MainLayout } from '../../components';
import { Routes } from '../../types';

enum TutorialKinds {
  Wallet = 'wallet',
  Node = 'node',
  Mining = 'mining',
  Lightning = 'lightning',
  Merchant = 'merchant',
}

const tutorialKinds = [
  {
    kind: TutorialKinds.Wallet,
    title: 'Wallet',
    image: walletSvg,
    description: "Solution de sécurisation et d'utilisation de vos bitcoins",
    route: Routes.Wallets
  },
  {
    kind: TutorialKinds.Node,
    title: 'Node',
    image: nodeSvg,
    description: "Solution de sécurisation et d'utilisation de vos bitcoins",
    route: Routes.Node
  },
  {
    kind: TutorialKinds.Mining,
    title: 'Mining',
    image: miningSvg,
    description: "Solution de sécurisation et d'utilisation de vos bitcoins",
    route: Routes.Mining
  },
  {
    kind: TutorialKinds.Lightning,
    title: 'Lightning',
    image: lightningSvg,
    description: "Solution de sécurisation et d'utilisation de vos bitcoins",
    route: Routes.Lightning
  },
  {
    kind: TutorialKinds.Merchant,
    title: 'Merchant',
    image: merchantSvg,
    description: "Solution de sécurisation et d'utilisation de vos bitcoins",
    route: Routes.Home
  },
];

export const Tutorials = () => {
  return (
    <MainLayout>
      <div className="bg-primary-700">
        <div className="flex relative flex-row flex-wrap justify-evenly px-12 pt-8 text-white bg-primary-900">
          <div>
            <h1 className="-ml-8 text-[128px] font-thin">Tutorials</h1>
            <div className="space-y-6 max-w-sm text-s text-justify">
              <p>
                Welcome into the infinit rabbit hole of Bitcoin ! In this
                section we will offer you in depth tutoriel on most bitcoin
                project out there. This pages in maintain by benevolel and
                passionate bitcoin who support thie open source project. If you
                fee we made a mistake please reach out. To see our financial
                attachement ot the project mention refer to our transparancie
                repport. Thanks for your trust in this university and enjoy the
                ride.
              </p>
              <p>Rogzy</p>
            </div>
          </div>
          <img className="mt-10 mb-40 h-96" src={tutoRabbitPng} />
        </div>

        <div className="box-content ml-[50%] -translate-x-1/2 flex flex-row flex-wrap justify-evenly px-12 py-8 w-[950px] max-w-[90vw] rounded-[50px] bg-primary-700">
          {tutorialKinds.map((tutorialKind) => (
            <Link to={tutorialKind.route}>
              <div
                className="box-content flex relative flex-row p-2 my-4 w-64 h-24 rounded-lg duration-300 cursor-pointer hover:bg-primary-600"
                key={tutorialKind.kind}
              >
                <div className="flex absolute z-0 w-24 h-24 rounded-full bg-secondary-400">
                  <img
                    className="h-16 m-auto"
                    src={tutorialKind.image}
                  />
                </div>
                <div className="flex relative flex-row items-center mt-4 -ml-8">
                  <div className="relative ml-32 pl-2 text-white z-1">
                    <h3 className="text-2xl">{tutorialKind.title}</h3>
                    <p className="text-xs italic">
                      {tutorialKind.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};