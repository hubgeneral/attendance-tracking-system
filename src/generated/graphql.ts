import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client/react";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
  Decimal: { input: any; output: any };
  LocalDate: { input: any; output: any };
};

export type ActivityLogger = {
  __typename?: "ActivityLogger";
  activityDescription?: Maybe<Scalars["String"]["output"]>;
  activityLog?: Maybe<Scalars["String"]["output"]>;
  appUserId: Scalars["Int"]["output"];
  id: Scalars["Int"]["output"];
  timeOfDay: Scalars["DateTime"]["output"];
  user?: Maybe<AppUser>;
};

export type ActivityLoggerFilterInput = {
  activityDescription?: InputMaybe<StringOperationFilterInput>;
  activityLog?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<ActivityLoggerFilterInput[]>;
  appUserId?: InputMaybe<IntOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<ActivityLoggerFilterInput[]>;
  timeOfDay?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<AppUserFilterInput>;
};

export type AppRole = {
  __typename?: "AppRole";
  concurrencyStamp?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["Int"]["output"];
  name?: Maybe<Scalars["String"]["output"]>;
  normalizedName?: Maybe<Scalars["String"]["output"]>;
  userRoles: AppUserRole[];
};

export type AppRoleFilterInput = {
  and?: InputMaybe<AppRoleFilterInput[]>;
  concurrencyStamp?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  normalizedName?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<AppRoleFilterInput[]>;
  userRoles?: InputMaybe<ListFilterInputTypeOfAppUserRoleFilterInput>;
};

export type AppUser = {
  __typename?: "AppUser";
  accessFailedCount: Scalars["Int"]["output"];
  activityLoggers?: Maybe<ActivityLogger[]>;
  attendances?: Maybe<Attendance[]>;
  concurrencyStamp?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  emailConfirmed: Scalars["Boolean"]["output"];
  employeeName?: Maybe<Scalars["String"]["output"]>;
  employeeType?: Maybe<Scalars["String"]["output"]>;
  exitLogs?: Maybe<ExitLog[]>;
  id: Scalars["Int"]["output"];
  isPasswordReset: Scalars["Boolean"]["output"];
  leaves?: Maybe<Leave[]>;
  lockoutEnabled: Scalars["Boolean"]["output"];
  lockoutEnd?: Maybe<Scalars["DateTime"]["output"]>;
  normalizedEmail?: Maybe<Scalars["String"]["output"]>;
  normalizedUserName?: Maybe<Scalars["String"]["output"]>;
  password?: Maybe<Scalars["String"]["output"]>;
  passwordHash?: Maybe<Scalars["String"]["output"]>;
  phoneNumber?: Maybe<Scalars["String"]["output"]>;
  phoneNumberConfirmed: Scalars["Boolean"]["output"];
  refreshTokens: RefreshToken[];
  requests?: Maybe<Request[]>;
  securityStamp?: Maybe<Scalars["String"]["output"]>;
  staffId?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  twoFactorEnabled: Scalars["Boolean"]["output"];
  userName?: Maybe<Scalars["String"]["output"]>;
  userRoles: AppUserRole[];
};

export type AppUserFilterInput = {
  accessFailedCount?: InputMaybe<IntOperationFilterInput>;
  activityLoggers?: InputMaybe<ListFilterInputTypeOfActivityLoggerFilterInput>;
  and?: InputMaybe<AppUserFilterInput[]>;
  attendances?: InputMaybe<ListFilterInputTypeOfAttendanceFilterInput>;
  concurrencyStamp?: InputMaybe<StringOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  emailConfirmed?: InputMaybe<BooleanOperationFilterInput>;
  employeeName?: InputMaybe<StringOperationFilterInput>;
  employeeType?: InputMaybe<StringOperationFilterInput>;
  exitLogs?: InputMaybe<ListFilterInputTypeOfExitLogFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isPasswordReset?: InputMaybe<BooleanOperationFilterInput>;
  leaves?: InputMaybe<ListFilterInputTypeOfLeaveFilterInput>;
  lockoutEnabled?: InputMaybe<BooleanOperationFilterInput>;
  lockoutEnd?: InputMaybe<DateTimeOperationFilterInput>;
  normalizedEmail?: InputMaybe<StringOperationFilterInput>;
  normalizedUserName?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<AppUserFilterInput[]>;
  password?: InputMaybe<StringOperationFilterInput>;
  passwordHash?: InputMaybe<StringOperationFilterInput>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  phoneNumberConfirmed?: InputMaybe<BooleanOperationFilterInput>;
  refreshTokens?: InputMaybe<ListFilterInputTypeOfRefreshTokenFilterInput>;
  requests?: InputMaybe<ListFilterInputTypeOfRequestFilterInput>;
  securityStamp?: InputMaybe<StringOperationFilterInput>;
  staffId?: InputMaybe<StringOperationFilterInput>;
  status?: InputMaybe<StringOperationFilterInput>;
  twoFactorEnabled?: InputMaybe<BooleanOperationFilterInput>;
  userName?: InputMaybe<StringOperationFilterInput>;
  userRoles?: InputMaybe<ListFilterInputTypeOfAppUserRoleFilterInput>;
};

export type AppUserRole = {
  __typename?: "AppUserRole";
  role: AppRole;
  roleId: Scalars["Int"]["output"];
  user: AppUser;
  userId: Scalars["Int"]["output"];
};

export type AppUserRoleFilterInput = {
  and?: InputMaybe<AppUserRoleFilterInput[]>;
  or?: InputMaybe<AppUserRoleFilterInput[]>;
  role?: InputMaybe<AppRoleFilterInput>;
  roleId?: InputMaybe<IntOperationFilterInput>;
  user?: InputMaybe<AppUserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type AppUserSortInput = {
  accessFailedCount?: InputMaybe<SortEnumType>;
  concurrencyStamp?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  emailConfirmed?: InputMaybe<SortEnumType>;
  employeeName?: InputMaybe<SortEnumType>;
  employeeType?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isPasswordReset?: InputMaybe<SortEnumType>;
  lockoutEnabled?: InputMaybe<SortEnumType>;
  lockoutEnd?: InputMaybe<SortEnumType>;
  normalizedEmail?: InputMaybe<SortEnumType>;
  normalizedUserName?: InputMaybe<SortEnumType>;
  password?: InputMaybe<SortEnumType>;
  passwordHash?: InputMaybe<SortEnumType>;
  phoneNumber?: InputMaybe<SortEnumType>;
  phoneNumberConfirmed?: InputMaybe<SortEnumType>;
  securityStamp?: InputMaybe<SortEnumType>;
  staffId?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  twoFactorEnabled?: InputMaybe<SortEnumType>;
  userName?: InputMaybe<SortEnumType>;
};

export type Attendance = {
  __typename?: "Attendance";
  appUserId: Scalars["Int"]["output"];
  clockIn?: Maybe<Scalars["DateTime"]["output"]>;
  clockOut?: Maybe<Scalars["DateTime"]["output"]>;
  clockingType: Scalars["Boolean"]["output"];
  currentDate?: Maybe<Scalars["LocalDate"]["output"]>;
  id: Scalars["Int"]["output"];
  status?: Maybe<Scalars["String"]["output"]>;
  totalHoursWorked?: Maybe<Scalars["Decimal"]["output"]>;
  user?: Maybe<AppUser>;
};

export type AttendanceFilterInput = {
  and?: InputMaybe<AttendanceFilterInput[]>;
  appUserId?: InputMaybe<IntOperationFilterInput>;
  clockIn?: InputMaybe<DateTimeOperationFilterInput>;
  clockOut?: InputMaybe<DateTimeOperationFilterInput>;
  clockingType?: InputMaybe<BooleanOperationFilterInput>;
  currentDate?: InputMaybe<LocalDateOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<AttendanceFilterInput[]>;
  status?: InputMaybe<StringOperationFilterInput>;
  totalHoursWorked?: InputMaybe<DecimalOperationFilterInput>;
  user?: InputMaybe<AppUserFilterInput>;
};

export type AttendanceSortInput = {
  appUserId?: InputMaybe<SortEnumType>;
  clockIn?: InputMaybe<SortEnumType>;
  clockOut?: InputMaybe<SortEnumType>;
  clockingType?: InputMaybe<SortEnumType>;
  currentDate?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  totalHoursWorked?: InputMaybe<SortEnumType>;
  user?: InputMaybe<AppUserSortInput>;
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  neq?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  in?: InputMaybe<InputMaybe<Scalars["DateTime"]["input"]>[]>;
  lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  neq?: InputMaybe<Scalars["DateTime"]["input"]>;
  ngt?: InputMaybe<Scalars["DateTime"]["input"]>;
  ngte?: InputMaybe<Scalars["DateTime"]["input"]>;
  nin?: InputMaybe<InputMaybe<Scalars["DateTime"]["input"]>[]>;
  nlt?: InputMaybe<Scalars["DateTime"]["input"]>;
  nlte?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type DecimalOperationFilterInput = {
  eq?: InputMaybe<Scalars["Decimal"]["input"]>;
  gt?: InputMaybe<Scalars["Decimal"]["input"]>;
  gte?: InputMaybe<Scalars["Decimal"]["input"]>;
  in?: InputMaybe<InputMaybe<Scalars["Decimal"]["input"]>[]>;
  lt?: InputMaybe<Scalars["Decimal"]["input"]>;
  lte?: InputMaybe<Scalars["Decimal"]["input"]>;
  neq?: InputMaybe<Scalars["Decimal"]["input"]>;
  ngt?: InputMaybe<Scalars["Decimal"]["input"]>;
  ngte?: InputMaybe<Scalars["Decimal"]["input"]>;
  nin?: InputMaybe<InputMaybe<Scalars["Decimal"]["input"]>[]>;
  nlt?: InputMaybe<Scalars["Decimal"]["input"]>;
  nlte?: InputMaybe<Scalars["Decimal"]["input"]>;
};

export type ExitLog = {
  __typename?: "ExitLog";
  appUserId: Scalars["Int"]["output"];
  currentDate: Scalars["LocalDate"]["output"];
  entryTime: Scalars["DateTime"]["output"];
  exitTime: Scalars["DateTime"]["output"];
  id: Scalars["Int"]["output"];
  totalExitTime: Scalars["Int"]["output"];
  user?: Maybe<AppUser>;
};

export type ExitLogFilterInput = {
  and?: InputMaybe<ExitLogFilterInput[]>;
  appUserId?: InputMaybe<IntOperationFilterInput>;
  currentDate?: InputMaybe<LocalDateOperationFilterInput>;
  entryTime?: InputMaybe<DateTimeOperationFilterInput>;
  exitTime?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<ExitLogFilterInput[]>;
  totalExitTime?: InputMaybe<IntOperationFilterInput>;
  user?: InputMaybe<AppUserFilterInput>;
};

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars["Int"]["input"]>;
  gt?: InputMaybe<Scalars["Int"]["input"]>;
  gte?: InputMaybe<Scalars["Int"]["input"]>;
  in?: InputMaybe<InputMaybe<Scalars["Int"]["input"]>[]>;
  lt?: InputMaybe<Scalars["Int"]["input"]>;
  lte?: InputMaybe<Scalars["Int"]["input"]>;
  neq?: InputMaybe<Scalars["Int"]["input"]>;
  ngt?: InputMaybe<Scalars["Int"]["input"]>;
  ngte?: InputMaybe<Scalars["Int"]["input"]>;
  nin?: InputMaybe<InputMaybe<Scalars["Int"]["input"]>[]>;
  nlt?: InputMaybe<Scalars["Int"]["input"]>;
  nlte?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Leave = {
  __typename?: "Leave";
  appUserId: Scalars["Int"]["output"];
  approvalStatus?: Maybe<Scalars["String"]["output"]>;
  daysRequested?: Maybe<Scalars["Int"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  employeeName?: Maybe<Scalars["String"]["output"]>;
  endDate?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["Int"]["output"];
  startDate?: Maybe<Scalars["DateTime"]["output"]>;
  user?: Maybe<AppUser>;
};

export type LeaveFilterInput = {
  and?: InputMaybe<LeaveFilterInput[]>;
  appUserId?: InputMaybe<IntOperationFilterInput>;
  approvalStatus?: InputMaybe<StringOperationFilterInput>;
  daysRequested?: InputMaybe<IntOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  employeeName?: InputMaybe<StringOperationFilterInput>;
  endDate?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<LeaveFilterInput[]>;
  startDate?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<AppUserFilterInput>;
};

export type ListFilterInputTypeOfActivityLoggerFilterInput = {
  all?: InputMaybe<ActivityLoggerFilterInput>;
  any?: InputMaybe<Scalars["Boolean"]["input"]>;
  none?: InputMaybe<ActivityLoggerFilterInput>;
  some?: InputMaybe<ActivityLoggerFilterInput>;
};

export type ListFilterInputTypeOfAppUserRoleFilterInput = {
  all?: InputMaybe<AppUserRoleFilterInput>;
  any?: InputMaybe<Scalars["Boolean"]["input"]>;
  none?: InputMaybe<AppUserRoleFilterInput>;
  some?: InputMaybe<AppUserRoleFilterInput>;
};

export type ListFilterInputTypeOfAttendanceFilterInput = {
  all?: InputMaybe<AttendanceFilterInput>;
  any?: InputMaybe<Scalars["Boolean"]["input"]>;
  none?: InputMaybe<AttendanceFilterInput>;
  some?: InputMaybe<AttendanceFilterInput>;
};

export type ListFilterInputTypeOfExitLogFilterInput = {
  all?: InputMaybe<ExitLogFilterInput>;
  any?: InputMaybe<Scalars["Boolean"]["input"]>;
  none?: InputMaybe<ExitLogFilterInput>;
  some?: InputMaybe<ExitLogFilterInput>;
};

export type ListFilterInputTypeOfLeaveFilterInput = {
  all?: InputMaybe<LeaveFilterInput>;
  any?: InputMaybe<Scalars["Boolean"]["input"]>;
  none?: InputMaybe<LeaveFilterInput>;
  some?: InputMaybe<LeaveFilterInput>;
};

export type ListFilterInputTypeOfRefreshTokenFilterInput = {
  all?: InputMaybe<RefreshTokenFilterInput>;
  any?: InputMaybe<Scalars["Boolean"]["input"]>;
  none?: InputMaybe<RefreshTokenFilterInput>;
  some?: InputMaybe<RefreshTokenFilterInput>;
};

export type ListFilterInputTypeOfRequestFilterInput = {
  all?: InputMaybe<RequestFilterInput>;
  any?: InputMaybe<Scalars["Boolean"]["input"]>;
  none?: InputMaybe<RequestFilterInput>;
  some?: InputMaybe<RequestFilterInput>;
};

export type LocalDateOperationFilterInput = {
  eq?: InputMaybe<Scalars["LocalDate"]["input"]>;
  gt?: InputMaybe<Scalars["LocalDate"]["input"]>;
  gte?: InputMaybe<Scalars["LocalDate"]["input"]>;
  in?: InputMaybe<InputMaybe<Scalars["LocalDate"]["input"]>[]>;
  lt?: InputMaybe<Scalars["LocalDate"]["input"]>;
  lte?: InputMaybe<Scalars["LocalDate"]["input"]>;
  neq?: InputMaybe<Scalars["LocalDate"]["input"]>;
  ngt?: InputMaybe<Scalars["LocalDate"]["input"]>;
  ngte?: InputMaybe<Scalars["LocalDate"]["input"]>;
  nin?: InputMaybe<InputMaybe<Scalars["LocalDate"]["input"]>[]>;
  nlt?: InputMaybe<Scalars["LocalDate"]["input"]>;
  nlte?: InputMaybe<Scalars["LocalDate"]["input"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  createAttendance: Attendance;
  createUser: AppUser;
  deleteAttendance: Scalars["Boolean"]["output"];
  deleteUser: Scalars["Boolean"]["output"];
  geoFenceClockIn: Scalars["String"]["output"];
  geofenceClockOut: Scalars["String"]["output"];
  login: UserLoginResponse;
  loginForForgottenPassword: UserLoginResponse;
  resetPassword: UserResetPasswordResponse;
  updateAttendance?: Maybe<Attendance>;
  updateUser?: Maybe<AppUser>;
};

export type MutationCreateAttendanceArgs = {
  appuserid: Scalars["Int"]["input"];
  clockin: Scalars["DateTime"]["input"];
  clockout: Scalars["DateTime"]["input"];
  currentdate: Scalars["LocalDate"]["input"];
  status: Scalars["String"]["input"];
  totalhoursworked: Scalars["Int"]["input"];
};

export type MutationCreateUserArgs = {
  email: Scalars["String"]["input"];
  employeeName: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  role: Scalars["String"]["input"];
  staffId: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
};

export type MutationDeleteAttendanceArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationDeleteUserArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationGeoFenceClockInArgs = {
  clockin: Scalars["DateTime"]["input"];
  username: Scalars["String"]["input"];
};

export type MutationGeofenceClockOutArgs = {
  username: Scalars["String"]["input"];
};

export type MutationLoginArgs = {
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type MutationLoginForForgottenPasswordArgs = {
  email: Scalars["String"]["input"];
  phoneno: Scalars["String"]["input"];
  staffid: Scalars["String"]["input"];
};

export type MutationResetPasswordArgs = {
  password: Scalars["String"]["input"];
  token: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type MutationUpdateAttendanceArgs = {
  appuserid: Scalars["Int"]["input"];
  clockin: Scalars["DateTime"]["input"];
  clockout: Scalars["DateTime"]["input"];
  currentdate: Scalars["LocalDate"]["input"];
  status: Scalars["String"]["input"];
  totalhoursworked: Scalars["Int"]["input"];
};

export type MutationUpdateUserArgs = {
  email: Scalars["String"]["input"];
  employeeName: Scalars["String"]["input"];
  id: Scalars["Int"]["input"];
  password: Scalars["String"]["input"];
  role: Scalars["String"]["input"];
  staffId: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
};

export type Query = {
  __typename?: "Query";
  attendanceByUserId: Attendance[];
  attendances: Attendance[];
  userById?: Maybe<AppUser>;
  users: AppUser[];
  usersWithRoles: UserWithRoleResponse[];
};

export type QueryAttendanceByUserIdArgs = {
  username: Scalars["String"]["input"];
};

export type QueryAttendancesArgs = {
  order?: InputMaybe<AttendanceSortInput[]>;
  where?: InputMaybe<AttendanceFilterInput>;
};

export type QueryUserByIdArgs = {
  id: Scalars["Int"]["input"];
};

export type QueryUsersArgs = {
  order?: InputMaybe<AppUserSortInput[]>;
  where?: InputMaybe<AppUserFilterInput>;
};

export type QueryUsersWithRolesArgs = {
  order?: InputMaybe<UserWithRoleResponseSortInput[]>;
  where?: InputMaybe<UserWithRoleResponseFilterInput>;
};

export type RefreshToken = {
  __typename?: "RefreshToken";
  appUserId: Scalars["Int"]["output"];
  expires: Scalars["DateTime"]["output"];
  id: Scalars["Int"]["output"];
  isRevoked: Scalars["Boolean"]["output"];
  isUsed: Scalars["Boolean"]["output"];
  token: Scalars["String"]["output"];
  user?: Maybe<AppUser>;
};

export type RefreshTokenFilterInput = {
  and?: InputMaybe<RefreshTokenFilterInput[]>;
  appUserId?: InputMaybe<IntOperationFilterInput>;
  expires?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isRevoked?: InputMaybe<BooleanOperationFilterInput>;
  isUsed?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<RefreshTokenFilterInput[]>;
  token?: InputMaybe<StringOperationFilterInput>;
  user?: InputMaybe<AppUserFilterInput>;
};

export type Request = {
  __typename?: "Request";
  appUserId: Scalars["Int"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["Int"]["output"];
  timeOfDay: Scalars["DateTime"]["output"];
  user?: Maybe<AppUser>;
};

export type RequestFilterInput = {
  and?: InputMaybe<RequestFilterInput[]>;
  appUserId?: InputMaybe<IntOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<RequestFilterInput[]>;
  timeOfDay?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<AppUserFilterInput>;
};

export enum SortEnumType {
  Asc = "ASC",
  Desc = "DESC",
}

export type StringOperationFilterInput = {
  and?: InputMaybe<StringOperationFilterInput[]>;
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  eq?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<InputMaybe<Scalars["String"]["input"]>[]>;
  ncontains?: InputMaybe<Scalars["String"]["input"]>;
  nendsWith?: InputMaybe<Scalars["String"]["input"]>;
  neq?: InputMaybe<Scalars["String"]["input"]>;
  nin?: InputMaybe<InputMaybe<Scalars["String"]["input"]>[]>;
  nstartsWith?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<StringOperationFilterInput[]>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type UserLoginResponse = {
  __typename?: "UserLoginResponse";
  accessToken?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  isPasswordReset: Scalars["Boolean"]["output"];
  refreshToken?: Maybe<Scalars["String"]["output"]>;
  role?: Maybe<Scalars["String"]["output"]>;
  userName?: Maybe<Scalars["String"]["output"]>;
};

export type UserResetPasswordResponse = {
  __typename?: "UserResetPasswordResponse";
  isPasswordReset?: Maybe<Scalars["Boolean"]["output"]>;
  message?: Maybe<Scalars["String"]["output"]>;
};

export type UserWithRoleResponse = {
  __typename?: "UserWithRoleResponse";
  email?: Maybe<Scalars["String"]["output"]>;
  employeeName?: Maybe<Scalars["String"]["output"]>;
  employeeType?: Maybe<Scalars["String"]["output"]>;
  roleId: Scalars["Int"]["output"];
  roleName?: Maybe<Scalars["String"]["output"]>;
  staffId?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  userId: Scalars["Int"]["output"];
  userName?: Maybe<Scalars["String"]["output"]>;
};

export type UserWithRoleResponseFilterInput = {
  and?: InputMaybe<UserWithRoleResponseFilterInput[]>;
  email?: InputMaybe<StringOperationFilterInput>;
  employeeName?: InputMaybe<StringOperationFilterInput>;
  employeeType?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<UserWithRoleResponseFilterInput[]>;
  roleId?: InputMaybe<IntOperationFilterInput>;
  roleName?: InputMaybe<StringOperationFilterInput>;
  staffId?: InputMaybe<StringOperationFilterInput>;
  status?: InputMaybe<StringOperationFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
  userName?: InputMaybe<StringOperationFilterInput>;
};

export type UserWithRoleResponseSortInput = {
  email?: InputMaybe<SortEnumType>;
  employeeName?: InputMaybe<SortEnumType>;
  employeeType?: InputMaybe<SortEnumType>;
  roleId?: InputMaybe<SortEnumType>;
  roleName?: InputMaybe<SortEnumType>;
  staffId?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
  userName?: InputMaybe<SortEnumType>;
};

export type LoginMutationVariables = Exact<{
  username: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
}>;

export type LoginMutation = {
  __typename?: "Mutation";
  login: {
    __typename?: "UserLoginResponse";
    id?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    isPasswordReset: boolean;
    userName?: string | null;
    role?: string | null;
  };
};

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type GetUserByIdQuery = {
  __typename?: "Query";
  userById?: {
    __typename?: "AppUser";
    id: number;
    employeeName?: string | null;
    email?: string | null;
    staffId?: string | null;
    phoneNumber?: string | null;
    status?: string | null;
    employeeType?: string | null;
    userName?: string | null;
    isPasswordReset: boolean;
    userRoles: {
      __typename?: "AppUserRole";
      role: { __typename?: "AppRole"; name?: string | null };
    }[];
  } | null;
};

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllUsersQuery = {
  __typename?: "Query";
  users: {
    __typename?: "AppUser";
    userName?: string | null;
    status?: string | null;
  }[];
};

export const LoginDocument = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      accessToken
      refreshToken
      isPasswordReset
      userName
      role
    }
  }
`;
export type LoginMutationFn = Apollo.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    options
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const GetUserByIdDocument = gql`
  query getUserById($id: Int!) {
    userById(id: $id) {
      id
      employeeName
      email
      staffId
      phoneNumber
      status
      employeeType
      userName
      isPasswordReset
      userRoles {
        role {
          name
        }
      }
    }
  }
`;

/**
 * __useGetUserByIdQuery__
 *
 * To run a query within a React component, call `useGetUserByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetUserByIdQuery,
    GetUserByIdQueryVariables
  > &
    (
      | { variables: GetUserByIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(
    GetUserByIdDocument,
    options
  );
}
export function useGetUserByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserByIdQuery,
    GetUserByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(
    GetUserByIdDocument,
    options
  );
}
export function useGetUserByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetUserByIdQuery,
        GetUserByIdQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(
    GetUserByIdDocument,
    options
  );
}
export type GetUserByIdQueryHookResult = ReturnType<typeof useGetUserByIdQuery>;
export type GetUserByIdLazyQueryHookResult = ReturnType<
  typeof useGetUserByIdLazyQuery
>;
export type GetUserByIdSuspenseQueryHookResult = ReturnType<
  typeof useGetUserByIdSuspenseQuery
>;
export type GetUserByIdQueryResult = Apollo.QueryResult<
  GetUserByIdQuery,
  GetUserByIdQueryVariables
>;
export const GetAllUsersDocument = gql`
  query getAllUsers {
    users {
      userName
      status
    }
  }
`;

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUsersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAllUsersQuery,
    GetAllUsersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(
    GetAllUsersDocument,
    options
  );
}
export function useGetAllUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAllUsersQuery,
    GetAllUsersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(
    GetAllUsersDocument,
    options
  );
}
export function useGetAllUsersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAllUsersQuery,
        GetAllUsersQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(
    GetAllUsersDocument,
    options
  );
}
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<
  typeof useGetAllUsersLazyQuery
>;
export type GetAllUsersSuspenseQueryHookResult = ReturnType<
  typeof useGetAllUsersSuspenseQuery
>;
export type GetAllUsersQueryResult = Apollo.QueryResult<
  GetAllUsersQuery,
  GetAllUsersQueryVariables
>;
