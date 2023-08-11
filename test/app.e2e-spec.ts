import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { useContainer } from 'class-validator';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const articleShape = expect.objectContaining({
    id: expect.any(Number),
    body: expect.any(String),
    title: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    published: expect.any(Boolean)
  });
  const articlesData = [
    {
      id: 1001,
      title: 'title1',
      description: 'description1',
      body: '1',
      published: true
    },
    {
      id: 1005,
      title: 'title2',
      description: 'description3',
      body: '2',
      published: true
    }
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    await prisma.article.create({
      data: articlesData[0]
    });

    await prisma.article.create({
      data: articlesData[1]
    });
  });

  describe('GET /articles', () => {
    it('returns a list published articles', async () => {
      const { status, body } = await request(app.getHttpServer()).get('/articles');

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([articleShape]));
      expect(body).toHaveLength(2);
      expect(body[0].published).toBeTruthy();
    });
  })
});
