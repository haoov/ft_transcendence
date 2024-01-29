import { IsString, Length, Matches } from 'class-validator';

export class updateUsernameDto {
  @IsString()
  @Length(3, 15)
  @Matches(/^[\x21-\x7E]+$/, {
    message: 'Username must contain only printable characters.',
  })
  @Matches(/^[a-zA-Z]/, {
    message: 'Username must start with a letter.',
  })
  username: string;
}