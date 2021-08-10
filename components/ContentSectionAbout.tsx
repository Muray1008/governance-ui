//import LinkLeft from './LinkLeft'
import GradientText from './GradientText'

const ContentSectionAbout = () => {
  return (
    <div
      id="about"
      className="bg-bkg-2 transform -skew-y-3 pt-16 pb-16 mb-16 -mt-32 z-0"
    >
      <div className="max-w-7xl mx-auto px-8 pt-24 pb-16 transform skew-y-3">
        <div className="py-16 ">
          <div className="mb-16 max-w-4xl mx-auto text-center">
            <h2 className="mb-4 text-3xl md:text-4xl lg:text-4xl text-white font-bold font-heading">
              Why release <GradientText>MNGO</GradientText> token?
            </h2>
            <p className="text-xl md:text-2xl lg:text-2xl text-white text-opacity-70">
              The MNGO token in its inception will serve 3 primary purposes.
            </p>
          </div>

          <div className="overflow-hidden">
            <div className="max-w-max lg:max-w-6xl mx-auto">
              <div className="relative">
                <div className="lg:grid lg:grid-cols-3 lg:gap-6">
                  <div className="lg:col-span-1">
                    <h2 className="text-2xl mb-4 leading-tight font-semibold font-heading">
                      Capitalize the Insurance Fund
                    </h2>
                    <p className="mb-8 text-base text-white text-opacity-70 leading-relaxed">
                      The Mango protocol relies on lenders to provide capital
                      for the others to use for trading and borrowing. The
                      capital in the Insurance Fund will be used to compensate
                      lenders in the unlikely event they incur losses.
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <h2 className="text-2xl mb-4 leading-tight font-semibold font-heading">
                      Govern the Mango DAO
                    </h2>
                    <p className="mb-8 text-base text-white text-opacity-70 leading-relaxed">
                      MNGO tokens represent a direct stake in the Mango DAO. The
                      future direction of the Mango Protocol will be decided by
                      voting on proposals using MNGO tokens as the voting
                      mechanism.
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <h2 className="text-2xl mb-4 leading-tight font-semibold font-heading">
                      Incentivize liquidity
                    </h2>
                    <p className="mb-8 text-base text-white text-opacity-70 leading-relaxed">
                      Bootstrapping liquidity is important in a new trading
                      system. Incentivizing market makers to provide it on our
                      order books with MNGO tokens will benefit the protocol and
                      its participants.
                    </p>
                  </div>
                </div>
                <div className="mt-10 py-5 px-5 bg-bkg-3 border border-bkg-4 shadow-md rounded-xl">
                  <h3 className="font-bold text-xl my-2">Token distribution</h3>

                  <div className="grid grid-cols-12 mt-4 py-1 px-1 rounded-md shadow-md bg-mango-med-dark">
                    <div className="col-span-10 bg-mango-green text-center rounded-l-sm py-1">
                      <span className="text-xs px-1 font-bold text-white">
                        90%
                      </span>
                    </div>
                    <div className="col-span-1 bg-mango-red text-center  py-1">
                      <span className="text-xs px-1 font-bold text-white">
                        5%
                      </span>
                    </div>
                    <div className="col-span-1 bg-blue-400 text-center rounded-r-sm  py-1">
                      <span className="text-xs px-1 font-bold text-white">
                        5%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 mt-4">
                    <div className="col-span-3 md:col-span-1 lg:col-span-1  m-1 p-1">
                      <p className="text-mango-green font-bold text-base my-2">
                        Mango DAO
                      </p>
                      <p className="text-white text-opacity-70">
                        90% of MNGO tokens will be locked in a smart contract,
                        only accessible via DAO governance votes.
                      </p>
                    </div>
                    <div className="col-span-3 md:col-span-1 lg:col-span-1  m-1 p-1">
                      <p className="text-mango-red font-bold text-base my-2">
                        Insurance Fund{' '}
                        <span className="text-gray-400">(Token Sale)</span>
                      </p>
                      <p className="text-white text-opacity-70">
                        5% of MNGO tokens will be used to capitalize the
                        Insurance Fund that will protect lenders in the Mango
                        Protocol.
                      </p>
                    </div>
                    <div className="col-span-3 md:col-span-1 lg:col-span-1  m-1 p-1">
                      <p className="text-blue-400 font-bold text-base my-2">
                        Contributor tokens
                      </p>
                      <p className="text-white text-opacity-70">
                        5% will be allocated to a distributed group of early
                        contributors, who worked tirelessly on this project over
                        the last year. These tokens are unlocked.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentSectionAbout
