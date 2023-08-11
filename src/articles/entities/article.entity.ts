import { ApiProperty } from "@nestjs/swagger";
import { Article } from "@prisma/client";

// here is described only a response example. The body of a response is in Article type
export class ArticleEntity implements Article {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty({required: false, nullable: true})
  description: string | null;
  body: string;
  @ApiProperty()
  published: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
