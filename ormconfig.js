const dbConfig = {
  synchronize: false,
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      // 근데 e2e 테스트에서는 타입스크립트 러너가 src에 있는 ts 파일을 실행하기 때문에 ts 파일을 사용해야 함
      entities: ['**/*.entity.ts'],
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('unknown environment');
}

module.exports = dbConfig;

// ormconfig.ts 는 사용할 수 없음.
// 개발단계에서 타입스크립트 러너가 실행되지 않고, 자바스크립트 러너가 실행됨.
// 그리고 빌드된 dist에 있는 자바스크립트들이 실행되기 때문에
// 타입스크립트 파일은 사용불가
