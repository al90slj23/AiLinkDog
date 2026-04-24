const fs = require('fs');
const file = '/Volumes/RuiRui4TB/CloudBackup/Mac/code/github/al90slj23/AiLinkDog/web/src/pages/Home/components/LandingHero.jsx';
let content = fs.readFileSync(file, 'utf8');

const replace = `<div className='ald-home-hero__primary-background' ref={robotRef}>
        <div className='ald-home-hero__robot-layer' ref={robotRef}>
          {isDesktop && shouldLoadScene ? (
            <Suspense fallback={<RobotPlaceholder />}>
              <HeroRobotScene isDesktop={isDesktop} shouldLoadScene={shouldLoadScene}>
                <RobotVendorLayer />
              </HeroRobotScene>
            </Suspense>
          ) : (
            <RobotPlaceholder />
          )}
        </div>
      </div>

      <div className='ald-home-hero__row ald-home-hero__row--primary'>
        <div className='ald-home-hero__primary-copy'>
          <LandingHeroCopy docsLink={docsLink} t={t} />
        </div>

        <div className='ald-home-hero__primary-robot'>
        </div>
      </div>`;

const search = `<div className='ald-home-hero__primary-background'></div>

      <div className='ald-home-hero__row ald-home-hero__row--primary'>
        <div className='ald-home-hero__primary-copy'>
          <LandingHeroCopy docsLink={docsLink} t={t} />
        </div>

        <div className='ald-home-hero__primary-robot' ref={robotRef}>
          <div className='ald-home-hero__robot-layer'>
            {isDesktop && shouldLoadScene ? (
              <Suspense fallback={<RobotPlaceholder />}>
                <HeroRobotScene isDesktop={isDesktop} shouldLoadScene={shouldLoadScene}>
                  <RobotVendorLayer />
                </HeroRobotScene>
              </Suspense>
            ) : (
              <RobotPlaceholder />
            )}
          </div>
        </div>
      </div>`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync(file, content);
    console.log('Reverted LandingHero.jsx');
} else {
    console.log('Search string not found in LandingHero.jsx');
}
