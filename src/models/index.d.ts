import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem } from "@aws-amplify/datastore";

export enum Type {
  VOLUNTARIO = "VOLUNTARIO",
  INSTITUICAO = "INSTITUICAO"
}

type MatchMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerMatch = {
  readonly id: string;
  readonly User2?: User | null;
  readonly User1?: User | null;
  readonly User1ID: string;
  readonly User2ID: string;
  readonly isMatch: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMatch = {
  readonly id: string;
  readonly User2: AsyncItem<User | undefined>;
  readonly User1: AsyncItem<User | undefined>;
  readonly User1ID: string;
  readonly User2ID: string;
  readonly isMatch: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Match = LazyLoading extends LazyLoadingDisabled ? EagerMatch : LazyMatch

export declare const Match: (new (init: ModelInit<Match, MatchMetaData>) => Match) & {
  copyOf(source: Match, mutator: (draft: MutableModel<Match, MatchMetaData>) => MutableModel<Match, MatchMetaData> | void): Match;
}

type EagerUser = {
  readonly id: string;
  readonly name: string;
  readonly image?: string | null;
  readonly bio: string;
  readonly type: Type | keyof typeof Type;
  readonly lookingFor?: Type | keyof typeof Type | null;
  readonly sub: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly id: string;
  readonly name: string;
  readonly image?: string | null;
  readonly bio: string;
  readonly type: Type | keyof typeof Type;
  readonly lookingFor?: Type | keyof typeof Type | null;
  readonly sub: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User, UserMetaData>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}