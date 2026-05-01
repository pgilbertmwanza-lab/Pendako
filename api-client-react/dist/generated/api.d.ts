import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { Account, AgedSummary, BalanceSheetReport, BankAccount, BankTransaction, Bill, CashFlowMonth, CashFlowStatement, Contact, ContactSummary, CreateAccountBody, CreateBankAccountBody, CreateBankTransactionBody, CreateBillBody, CreateContactBody, CreateInvoiceBody, CreatePaymentBody, DashboardSummary, DrillAccountResponse, DrillSourceResponse, GeneralLedgerAccount, GetBalanceSheetReportParams, GetCashFlowStatementParams, GetDrillAccountParams, GetDrillSourceParams, GetGeneralLedgerReportParams, GetProfitLossReportParams, GetTrialBalanceReportParams, HealthStatus, Invoice, InvoiceStats, ListAccountsParams, ListBankTransactionsParams, ListBillsParams, ListContactsParams, ListInvoicesParams, Payment, ProfitLossReport, TrialBalanceReport } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get dashboard financial summary
 */
export declare const getGetDashboardSummaryUrl: () => string;
export declare const getDashboardSummary: (options?: RequestInit) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/dashboard/summary"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard financial summary
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Monthly cash flow for the last 6 months
 */
export declare const getGetCashFlowUrl: () => string;
export declare const getCashFlow: (options?: RequestInit) => Promise<CashFlowMonth[]>;
export declare const getGetCashFlowQueryKey: () => readonly ["/api/dashboard/cash-flow"];
export declare const getGetCashFlowQueryOptions: <TData = Awaited<ReturnType<typeof getCashFlow>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCashFlow>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCashFlow>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCashFlowQueryResult = NonNullable<Awaited<ReturnType<typeof getCashFlow>>>;
export type GetCashFlowQueryError = ErrorType<unknown>;
/**
 * @summary Monthly cash flow for the last 6 months
 */
export declare function useGetCashFlow<TData = Awaited<ReturnType<typeof getCashFlow>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCashFlow>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Aged receivables summary
 */
export declare const getGetAgedReceivablesUrl: () => string;
export declare const getAgedReceivables: (options?: RequestInit) => Promise<AgedSummary>;
export declare const getGetAgedReceivablesQueryKey: () => readonly ["/api/dashboard/aged-receivables"];
export declare const getGetAgedReceivablesQueryOptions: <TData = Awaited<ReturnType<typeof getAgedReceivables>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAgedReceivables>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAgedReceivables>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAgedReceivablesQueryResult = NonNullable<Awaited<ReturnType<typeof getAgedReceivables>>>;
export type GetAgedReceivablesQueryError = ErrorType<unknown>;
/**
 * @summary Aged receivables summary
 */
export declare function useGetAgedReceivables<TData = Awaited<ReturnType<typeof getAgedReceivables>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAgedReceivables>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Aged payables summary
 */
export declare const getGetAgedPayablesUrl: () => string;
export declare const getAgedPayables: (options?: RequestInit) => Promise<AgedSummary>;
export declare const getGetAgedPayablesQueryKey: () => readonly ["/api/dashboard/aged-payables"];
export declare const getGetAgedPayablesQueryOptions: <TData = Awaited<ReturnType<typeof getAgedPayables>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAgedPayables>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAgedPayables>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAgedPayablesQueryResult = NonNullable<Awaited<ReturnType<typeof getAgedPayables>>>;
export type GetAgedPayablesQueryError = ErrorType<unknown>;
/**
 * @summary Aged payables summary
 */
export declare function useGetAgedPayables<TData = Awaited<ReturnType<typeof getAgedPayables>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAgedPayables>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all contacts
 */
export declare const getListContactsUrl: (params?: ListContactsParams) => string;
export declare const listContacts: (params?: ListContactsParams, options?: RequestInit) => Promise<Contact[]>;
export declare const getListContactsQueryKey: (params?: ListContactsParams) => readonly ["/api/contacts", ...ListContactsParams[]];
export declare const getListContactsQueryOptions: <TData = Awaited<ReturnType<typeof listContacts>>, TError = ErrorType<unknown>>(params?: ListContactsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listContacts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listContacts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListContactsQueryResult = NonNullable<Awaited<ReturnType<typeof listContacts>>>;
export type ListContactsQueryError = ErrorType<unknown>;
/**
 * @summary List all contacts
 */
export declare function useListContacts<TData = Awaited<ReturnType<typeof listContacts>>, TError = ErrorType<unknown>>(params?: ListContactsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listContacts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a contact
 */
export declare const getCreateContactUrl: () => string;
export declare const createContact: (createContactBody: CreateContactBody, options?: RequestInit) => Promise<Contact>;
export declare const getCreateContactMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createContact>>, TError, {
        data: BodyType<CreateContactBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createContact>>, TError, {
    data: BodyType<CreateContactBody>;
}, TContext>;
export type CreateContactMutationResult = NonNullable<Awaited<ReturnType<typeof createContact>>>;
export type CreateContactMutationBody = BodyType<CreateContactBody>;
export type CreateContactMutationError = ErrorType<unknown>;
/**
 * @summary Create a contact
 */
export declare const useCreateContact: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createContact>>, TError, {
        data: BodyType<CreateContactBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createContact>>, TError, {
    data: BodyType<CreateContactBody>;
}, TContext>;
/**
 * @summary Get a contact
 */
export declare const getGetContactUrl: (id: number) => string;
export declare const getContact: (id: number, options?: RequestInit) => Promise<Contact>;
export declare const getGetContactQueryKey: (id: number) => readonly [`/api/contacts/${number}`];
export declare const getGetContactQueryOptions: <TData = Awaited<ReturnType<typeof getContact>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getContact>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getContact>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetContactQueryResult = NonNullable<Awaited<ReturnType<typeof getContact>>>;
export type GetContactQueryError = ErrorType<unknown>;
/**
 * @summary Get a contact
 */
export declare function useGetContact<TData = Awaited<ReturnType<typeof getContact>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getContact>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a contact
 */
export declare const getUpdateContactUrl: (id: number) => string;
export declare const updateContact: (id: number, createContactBody: CreateContactBody, options?: RequestInit) => Promise<Contact>;
export declare const getUpdateContactMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateContact>>, TError, {
        id: number;
        data: BodyType<CreateContactBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateContact>>, TError, {
    id: number;
    data: BodyType<CreateContactBody>;
}, TContext>;
export type UpdateContactMutationResult = NonNullable<Awaited<ReturnType<typeof updateContact>>>;
export type UpdateContactMutationBody = BodyType<CreateContactBody>;
export type UpdateContactMutationError = ErrorType<unknown>;
/**
 * @summary Update a contact
 */
export declare const useUpdateContact: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateContact>>, TError, {
        id: number;
        data: BodyType<CreateContactBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateContact>>, TError, {
    id: number;
    data: BodyType<CreateContactBody>;
}, TContext>;
/**
 * @summary Delete a contact
 */
export declare const getDeleteContactUrl: (id: number) => string;
export declare const deleteContact: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteContactMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteContact>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteContact>>, TError, {
    id: number;
}, TContext>;
export type DeleteContactMutationResult = NonNullable<Awaited<ReturnType<typeof deleteContact>>>;
export type DeleteContactMutationError = ErrorType<unknown>;
/**
 * @summary Delete a contact
 */
export declare const useDeleteContact: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteContact>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteContact>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Get financial summary for a contact
 */
export declare const getGetContactSummaryUrl: (id: number) => string;
export declare const getContactSummary: (id: number, options?: RequestInit) => Promise<ContactSummary>;
export declare const getGetContactSummaryQueryKey: (id: number) => readonly [`/api/contacts/${number}/summary`];
export declare const getGetContactSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getContactSummary>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getContactSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getContactSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetContactSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getContactSummary>>>;
export type GetContactSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get financial summary for a contact
 */
export declare function useGetContactSummary<TData = Awaited<ReturnType<typeof getContactSummary>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getContactSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List chart of accounts
 */
export declare const getListAccountsUrl: (params?: ListAccountsParams) => string;
export declare const listAccounts: (params?: ListAccountsParams, options?: RequestInit) => Promise<Account[]>;
export declare const getListAccountsQueryKey: (params?: ListAccountsParams) => readonly ["/api/accounts", ...ListAccountsParams[]];
export declare const getListAccountsQueryOptions: <TData = Awaited<ReturnType<typeof listAccounts>>, TError = ErrorType<unknown>>(params?: ListAccountsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAccounts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAccounts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAccountsQueryResult = NonNullable<Awaited<ReturnType<typeof listAccounts>>>;
export type ListAccountsQueryError = ErrorType<unknown>;
/**
 * @summary List chart of accounts
 */
export declare function useListAccounts<TData = Awaited<ReturnType<typeof listAccounts>>, TError = ErrorType<unknown>>(params?: ListAccountsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAccounts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create an account
 */
export declare const getCreateAccountUrl: () => string;
export declare const createAccount: (createAccountBody: CreateAccountBody, options?: RequestInit) => Promise<Account>;
export declare const getCreateAccountMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAccount>>, TError, {
        data: BodyType<CreateAccountBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAccount>>, TError, {
    data: BodyType<CreateAccountBody>;
}, TContext>;
export type CreateAccountMutationResult = NonNullable<Awaited<ReturnType<typeof createAccount>>>;
export type CreateAccountMutationBody = BodyType<CreateAccountBody>;
export type CreateAccountMutationError = ErrorType<unknown>;
/**
 * @summary Create an account
 */
export declare const useCreateAccount: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAccount>>, TError, {
        data: BodyType<CreateAccountBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAccount>>, TError, {
    data: BodyType<CreateAccountBody>;
}, TContext>;
/**
 * @summary Get an account
 */
export declare const getGetAccountUrl: (id: number) => string;
export declare const getAccount: (id: number, options?: RequestInit) => Promise<Account>;
export declare const getGetAccountQueryKey: (id: number) => readonly [`/api/accounts/${number}`];
export declare const getGetAccountQueryOptions: <TData = Awaited<ReturnType<typeof getAccount>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAccount>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAccount>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAccountQueryResult = NonNullable<Awaited<ReturnType<typeof getAccount>>>;
export type GetAccountQueryError = ErrorType<unknown>;
/**
 * @summary Get an account
 */
export declare function useGetAccount<TData = Awaited<ReturnType<typeof getAccount>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAccount>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update an account
 */
export declare const getUpdateAccountUrl: (id: number) => string;
export declare const updateAccount: (id: number, createAccountBody: CreateAccountBody, options?: RequestInit) => Promise<Account>;
export declare const getUpdateAccountMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAccount>>, TError, {
        id: number;
        data: BodyType<CreateAccountBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAccount>>, TError, {
    id: number;
    data: BodyType<CreateAccountBody>;
}, TContext>;
export type UpdateAccountMutationResult = NonNullable<Awaited<ReturnType<typeof updateAccount>>>;
export type UpdateAccountMutationBody = BodyType<CreateAccountBody>;
export type UpdateAccountMutationError = ErrorType<unknown>;
/**
 * @summary Update an account
 */
export declare const useUpdateAccount: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAccount>>, TError, {
        id: number;
        data: BodyType<CreateAccountBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAccount>>, TError, {
    id: number;
    data: BodyType<CreateAccountBody>;
}, TContext>;
/**
 * @summary Delete an account
 */
export declare const getDeleteAccountUrl: (id: number) => string;
export declare const deleteAccount: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteAccountMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAccount>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteAccount>>, TError, {
    id: number;
}, TContext>;
export type DeleteAccountMutationResult = NonNullable<Awaited<ReturnType<typeof deleteAccount>>>;
export type DeleteAccountMutationError = ErrorType<unknown>;
/**
 * @summary Delete an account
 */
export declare const useDeleteAccount: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAccount>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteAccount>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List invoices
 */
export declare const getListInvoicesUrl: (params?: ListInvoicesParams) => string;
export declare const listInvoices: (params?: ListInvoicesParams, options?: RequestInit) => Promise<Invoice[]>;
export declare const getListInvoicesQueryKey: (params?: ListInvoicesParams) => readonly ["/api/invoices", ...ListInvoicesParams[]];
export declare const getListInvoicesQueryOptions: <TData = Awaited<ReturnType<typeof listInvoices>>, TError = ErrorType<unknown>>(params?: ListInvoicesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listInvoices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listInvoices>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListInvoicesQueryResult = NonNullable<Awaited<ReturnType<typeof listInvoices>>>;
export type ListInvoicesQueryError = ErrorType<unknown>;
/**
 * @summary List invoices
 */
export declare function useListInvoices<TData = Awaited<ReturnType<typeof listInvoices>>, TError = ErrorType<unknown>>(params?: ListInvoicesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listInvoices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create an invoice
 */
export declare const getCreateInvoiceUrl: () => string;
export declare const createInvoice: (createInvoiceBody: CreateInvoiceBody, options?: RequestInit) => Promise<Invoice>;
export declare const getCreateInvoiceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createInvoice>>, TError, {
        data: BodyType<CreateInvoiceBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createInvoice>>, TError, {
    data: BodyType<CreateInvoiceBody>;
}, TContext>;
export type CreateInvoiceMutationResult = NonNullable<Awaited<ReturnType<typeof createInvoice>>>;
export type CreateInvoiceMutationBody = BodyType<CreateInvoiceBody>;
export type CreateInvoiceMutationError = ErrorType<unknown>;
/**
 * @summary Create an invoice
 */
export declare const useCreateInvoice: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createInvoice>>, TError, {
        data: BodyType<CreateInvoiceBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createInvoice>>, TError, {
    data: BodyType<CreateInvoiceBody>;
}, TContext>;
/**
 * @summary Get an invoice
 */
export declare const getGetInvoiceUrl: (id: number) => string;
export declare const getInvoice: (id: number, options?: RequestInit) => Promise<Invoice>;
export declare const getGetInvoiceQueryKey: (id: number) => readonly [`/api/invoices/${number}`];
export declare const getGetInvoiceQueryOptions: <TData = Awaited<ReturnType<typeof getInvoice>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInvoice>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getInvoice>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetInvoiceQueryResult = NonNullable<Awaited<ReturnType<typeof getInvoice>>>;
export type GetInvoiceQueryError = ErrorType<unknown>;
/**
 * @summary Get an invoice
 */
export declare function useGetInvoice<TData = Awaited<ReturnType<typeof getInvoice>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInvoice>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update an invoice
 */
export declare const getUpdateInvoiceUrl: (id: number) => string;
export declare const updateInvoice: (id: number, createInvoiceBody: CreateInvoiceBody, options?: RequestInit) => Promise<Invoice>;
export declare const getUpdateInvoiceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateInvoice>>, TError, {
        id: number;
        data: BodyType<CreateInvoiceBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateInvoice>>, TError, {
    id: number;
    data: BodyType<CreateInvoiceBody>;
}, TContext>;
export type UpdateInvoiceMutationResult = NonNullable<Awaited<ReturnType<typeof updateInvoice>>>;
export type UpdateInvoiceMutationBody = BodyType<CreateInvoiceBody>;
export type UpdateInvoiceMutationError = ErrorType<unknown>;
/**
 * @summary Update an invoice
 */
export declare const useUpdateInvoice: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateInvoice>>, TError, {
        id: number;
        data: BodyType<CreateInvoiceBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateInvoice>>, TError, {
    id: number;
    data: BodyType<CreateInvoiceBody>;
}, TContext>;
/**
 * @summary Void/delete an invoice
 */
export declare const getDeleteInvoiceUrl: (id: number) => string;
export declare const deleteInvoice: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteInvoiceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteInvoice>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteInvoice>>, TError, {
    id: number;
}, TContext>;
export type DeleteInvoiceMutationResult = NonNullable<Awaited<ReturnType<typeof deleteInvoice>>>;
export type DeleteInvoiceMutationError = ErrorType<unknown>;
/**
 * @summary Void/delete an invoice
 */
export declare const useDeleteInvoice: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteInvoice>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteInvoice>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Mark invoice as sent
 */
export declare const getSendInvoiceUrl: (id: number) => string;
export declare const sendInvoice: (id: number, options?: RequestInit) => Promise<Invoice>;
export declare const getSendInvoiceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendInvoice>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendInvoice>>, TError, {
    id: number;
}, TContext>;
export type SendInvoiceMutationResult = NonNullable<Awaited<ReturnType<typeof sendInvoice>>>;
export type SendInvoiceMutationError = ErrorType<unknown>;
/**
 * @summary Mark invoice as sent
 */
export declare const useSendInvoice: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendInvoice>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendInvoice>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Invoice statistics (total by status)
 */
export declare const getGetInvoiceStatsUrl: () => string;
export declare const getInvoiceStats: (options?: RequestInit) => Promise<InvoiceStats>;
export declare const getGetInvoiceStatsQueryKey: () => readonly ["/api/invoices/stats"];
export declare const getGetInvoiceStatsQueryOptions: <TData = Awaited<ReturnType<typeof getInvoiceStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInvoiceStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getInvoiceStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetInvoiceStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getInvoiceStats>>>;
export type GetInvoiceStatsQueryError = ErrorType<unknown>;
/**
 * @summary Invoice statistics (total by status)
 */
export declare function useGetInvoiceStats<TData = Awaited<ReturnType<typeof getInvoiceStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInvoiceStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List bills
 */
export declare const getListBillsUrl: (params?: ListBillsParams) => string;
export declare const listBills: (params?: ListBillsParams, options?: RequestInit) => Promise<Bill[]>;
export declare const getListBillsQueryKey: (params?: ListBillsParams) => readonly ["/api/bills", ...ListBillsParams[]];
export declare const getListBillsQueryOptions: <TData = Awaited<ReturnType<typeof listBills>>, TError = ErrorType<unknown>>(params?: ListBillsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBills>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBills>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBillsQueryResult = NonNullable<Awaited<ReturnType<typeof listBills>>>;
export type ListBillsQueryError = ErrorType<unknown>;
/**
 * @summary List bills
 */
export declare function useListBills<TData = Awaited<ReturnType<typeof listBills>>, TError = ErrorType<unknown>>(params?: ListBillsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBills>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a bill
 */
export declare const getCreateBillUrl: () => string;
export declare const createBill: (createBillBody: CreateBillBody, options?: RequestInit) => Promise<Bill>;
export declare const getCreateBillMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBill>>, TError, {
        data: BodyType<CreateBillBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createBill>>, TError, {
    data: BodyType<CreateBillBody>;
}, TContext>;
export type CreateBillMutationResult = NonNullable<Awaited<ReturnType<typeof createBill>>>;
export type CreateBillMutationBody = BodyType<CreateBillBody>;
export type CreateBillMutationError = ErrorType<unknown>;
/**
 * @summary Create a bill
 */
export declare const useCreateBill: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBill>>, TError, {
        data: BodyType<CreateBillBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createBill>>, TError, {
    data: BodyType<CreateBillBody>;
}, TContext>;
/**
 * @summary Get a bill
 */
export declare const getGetBillUrl: (id: number) => string;
export declare const getBill: (id: number, options?: RequestInit) => Promise<Bill>;
export declare const getGetBillQueryKey: (id: number) => readonly [`/api/bills/${number}`];
export declare const getGetBillQueryOptions: <TData = Awaited<ReturnType<typeof getBill>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBill>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBill>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBillQueryResult = NonNullable<Awaited<ReturnType<typeof getBill>>>;
export type GetBillQueryError = ErrorType<unknown>;
/**
 * @summary Get a bill
 */
export declare function useGetBill<TData = Awaited<ReturnType<typeof getBill>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBill>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a bill
 */
export declare const getUpdateBillUrl: (id: number) => string;
export declare const updateBill: (id: number, createBillBody: CreateBillBody, options?: RequestInit) => Promise<Bill>;
export declare const getUpdateBillMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBill>>, TError, {
        id: number;
        data: BodyType<CreateBillBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateBill>>, TError, {
    id: number;
    data: BodyType<CreateBillBody>;
}, TContext>;
export type UpdateBillMutationResult = NonNullable<Awaited<ReturnType<typeof updateBill>>>;
export type UpdateBillMutationBody = BodyType<CreateBillBody>;
export type UpdateBillMutationError = ErrorType<unknown>;
/**
 * @summary Update a bill
 */
export declare const useUpdateBill: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBill>>, TError, {
        id: number;
        data: BodyType<CreateBillBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateBill>>, TError, {
    id: number;
    data: BodyType<CreateBillBody>;
}, TContext>;
/**
 * @summary Delete a bill
 */
export declare const getDeleteBillUrl: (id: number) => string;
export declare const deleteBill: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteBillMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBill>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteBill>>, TError, {
    id: number;
}, TContext>;
export type DeleteBillMutationResult = NonNullable<Awaited<ReturnType<typeof deleteBill>>>;
export type DeleteBillMutationError = ErrorType<unknown>;
/**
 * @summary Delete a bill
 */
export declare const useDeleteBill: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBill>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteBill>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List payments
 */
export declare const getListPaymentsUrl: () => string;
export declare const listPayments: (options?: RequestInit) => Promise<Payment[]>;
export declare const getListPaymentsQueryKey: () => readonly ["/api/payments"];
export declare const getListPaymentsQueryOptions: <TData = Awaited<ReturnType<typeof listPayments>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPayments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPayments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPaymentsQueryResult = NonNullable<Awaited<ReturnType<typeof listPayments>>>;
export type ListPaymentsQueryError = ErrorType<unknown>;
/**
 * @summary List payments
 */
export declare function useListPayments<TData = Awaited<ReturnType<typeof listPayments>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPayments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a payment
 */
export declare const getCreatePaymentUrl: () => string;
export declare const createPayment: (createPaymentBody: CreatePaymentBody, options?: RequestInit) => Promise<Payment>;
export declare const getCreatePaymentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPayment>>, TError, {
        data: BodyType<CreatePaymentBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPayment>>, TError, {
    data: BodyType<CreatePaymentBody>;
}, TContext>;
export type CreatePaymentMutationResult = NonNullable<Awaited<ReturnType<typeof createPayment>>>;
export type CreatePaymentMutationBody = BodyType<CreatePaymentBody>;
export type CreatePaymentMutationError = ErrorType<unknown>;
/**
 * @summary Create a payment
 */
export declare const useCreatePayment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPayment>>, TError, {
        data: BodyType<CreatePaymentBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPayment>>, TError, {
    data: BodyType<CreatePaymentBody>;
}, TContext>;
/**
 * @summary Get a payment
 */
export declare const getGetPaymentUrl: (id: number) => string;
export declare const getPayment: (id: number, options?: RequestInit) => Promise<Payment>;
export declare const getGetPaymentQueryKey: (id: number) => readonly [`/api/payments/${number}`];
export declare const getGetPaymentQueryOptions: <TData = Awaited<ReturnType<typeof getPayment>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPayment>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPayment>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPaymentQueryResult = NonNullable<Awaited<ReturnType<typeof getPayment>>>;
export type GetPaymentQueryError = ErrorType<unknown>;
/**
 * @summary Get a payment
 */
export declare function useGetPayment<TData = Awaited<ReturnType<typeof getPayment>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPayment>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Delete a payment
 */
export declare const getDeletePaymentUrl: (id: number) => string;
export declare const deletePayment: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeletePaymentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePayment>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deletePayment>>, TError, {
    id: number;
}, TContext>;
export type DeletePaymentMutationResult = NonNullable<Awaited<ReturnType<typeof deletePayment>>>;
export type DeletePaymentMutationError = ErrorType<unknown>;
/**
 * @summary Delete a payment
 */
export declare const useDeletePayment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePayment>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deletePayment>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List bank accounts
 */
export declare const getListBankAccountsUrl: () => string;
export declare const listBankAccounts: (options?: RequestInit) => Promise<BankAccount[]>;
export declare const getListBankAccountsQueryKey: () => readonly ["/api/bank-accounts"];
export declare const getListBankAccountsQueryOptions: <TData = Awaited<ReturnType<typeof listBankAccounts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBankAccounts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBankAccounts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBankAccountsQueryResult = NonNullable<Awaited<ReturnType<typeof listBankAccounts>>>;
export type ListBankAccountsQueryError = ErrorType<unknown>;
/**
 * @summary List bank accounts
 */
export declare function useListBankAccounts<TData = Awaited<ReturnType<typeof listBankAccounts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBankAccounts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a bank account
 */
export declare const getCreateBankAccountUrl: () => string;
export declare const createBankAccount: (createBankAccountBody: CreateBankAccountBody, options?: RequestInit) => Promise<BankAccount>;
export declare const getCreateBankAccountMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBankAccount>>, TError, {
        data: BodyType<CreateBankAccountBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createBankAccount>>, TError, {
    data: BodyType<CreateBankAccountBody>;
}, TContext>;
export type CreateBankAccountMutationResult = NonNullable<Awaited<ReturnType<typeof createBankAccount>>>;
export type CreateBankAccountMutationBody = BodyType<CreateBankAccountBody>;
export type CreateBankAccountMutationError = ErrorType<unknown>;
/**
 * @summary Create a bank account
 */
export declare const useCreateBankAccount: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBankAccount>>, TError, {
        data: BodyType<CreateBankAccountBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createBankAccount>>, TError, {
    data: BodyType<CreateBankAccountBody>;
}, TContext>;
/**
 * @summary Get a bank account
 */
export declare const getGetBankAccountUrl: (id: number) => string;
export declare const getBankAccount: (id: number, options?: RequestInit) => Promise<BankAccount>;
export declare const getGetBankAccountQueryKey: (id: number) => readonly [`/api/bank-accounts/${number}`];
export declare const getGetBankAccountQueryOptions: <TData = Awaited<ReturnType<typeof getBankAccount>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBankAccount>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBankAccount>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBankAccountQueryResult = NonNullable<Awaited<ReturnType<typeof getBankAccount>>>;
export type GetBankAccountQueryError = ErrorType<unknown>;
/**
 * @summary Get a bank account
 */
export declare function useGetBankAccount<TData = Awaited<ReturnType<typeof getBankAccount>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBankAccount>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a bank account
 */
export declare const getUpdateBankAccountUrl: (id: number) => string;
export declare const updateBankAccount: (id: number, createBankAccountBody: CreateBankAccountBody, options?: RequestInit) => Promise<BankAccount>;
export declare const getUpdateBankAccountMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBankAccount>>, TError, {
        id: number;
        data: BodyType<CreateBankAccountBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateBankAccount>>, TError, {
    id: number;
    data: BodyType<CreateBankAccountBody>;
}, TContext>;
export type UpdateBankAccountMutationResult = NonNullable<Awaited<ReturnType<typeof updateBankAccount>>>;
export type UpdateBankAccountMutationBody = BodyType<CreateBankAccountBody>;
export type UpdateBankAccountMutationError = ErrorType<unknown>;
/**
 * @summary Update a bank account
 */
export declare const useUpdateBankAccount: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBankAccount>>, TError, {
        id: number;
        data: BodyType<CreateBankAccountBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateBankAccount>>, TError, {
    id: number;
    data: BodyType<CreateBankAccountBody>;
}, TContext>;
/**
 * @summary Delete a bank account
 */
export declare const getDeleteBankAccountUrl: (id: number) => string;
export declare const deleteBankAccount: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteBankAccountMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBankAccount>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteBankAccount>>, TError, {
    id: number;
}, TContext>;
export type DeleteBankAccountMutationResult = NonNullable<Awaited<ReturnType<typeof deleteBankAccount>>>;
export type DeleteBankAccountMutationError = ErrorType<unknown>;
/**
 * @summary Delete a bank account
 */
export declare const useDeleteBankAccount: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBankAccount>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteBankAccount>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List bank transactions
 */
export declare const getListBankTransactionsUrl: (params?: ListBankTransactionsParams) => string;
export declare const listBankTransactions: (params?: ListBankTransactionsParams, options?: RequestInit) => Promise<BankTransaction[]>;
export declare const getListBankTransactionsQueryKey: (params?: ListBankTransactionsParams) => readonly ["/api/bank-transactions", ...ListBankTransactionsParams[]];
export declare const getListBankTransactionsQueryOptions: <TData = Awaited<ReturnType<typeof listBankTransactions>>, TError = ErrorType<unknown>>(params?: ListBankTransactionsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBankTransactions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBankTransactions>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBankTransactionsQueryResult = NonNullable<Awaited<ReturnType<typeof listBankTransactions>>>;
export type ListBankTransactionsQueryError = ErrorType<unknown>;
/**
 * @summary List bank transactions
 */
export declare function useListBankTransactions<TData = Awaited<ReturnType<typeof listBankTransactions>>, TError = ErrorType<unknown>>(params?: ListBankTransactionsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBankTransactions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a bank transaction
 */
export declare const getCreateBankTransactionUrl: () => string;
export declare const createBankTransaction: (createBankTransactionBody: CreateBankTransactionBody, options?: RequestInit) => Promise<BankTransaction>;
export declare const getCreateBankTransactionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBankTransaction>>, TError, {
        data: BodyType<CreateBankTransactionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createBankTransaction>>, TError, {
    data: BodyType<CreateBankTransactionBody>;
}, TContext>;
export type CreateBankTransactionMutationResult = NonNullable<Awaited<ReturnType<typeof createBankTransaction>>>;
export type CreateBankTransactionMutationBody = BodyType<CreateBankTransactionBody>;
export type CreateBankTransactionMutationError = ErrorType<unknown>;
/**
 * @summary Create a bank transaction
 */
export declare const useCreateBankTransaction: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBankTransaction>>, TError, {
        data: BodyType<CreateBankTransactionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createBankTransaction>>, TError, {
    data: BodyType<CreateBankTransactionBody>;
}, TContext>;
/**
 * @summary Get a bank transaction
 */
export declare const getGetBankTransactionUrl: (id: number) => string;
export declare const getBankTransaction: (id: number, options?: RequestInit) => Promise<BankTransaction>;
export declare const getGetBankTransactionQueryKey: (id: number) => readonly [`/api/bank-transactions/${number}`];
export declare const getGetBankTransactionQueryOptions: <TData = Awaited<ReturnType<typeof getBankTransaction>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBankTransaction>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBankTransaction>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBankTransactionQueryResult = NonNullable<Awaited<ReturnType<typeof getBankTransaction>>>;
export type GetBankTransactionQueryError = ErrorType<unknown>;
/**
 * @summary Get a bank transaction
 */
export declare function useGetBankTransaction<TData = Awaited<ReturnType<typeof getBankTransaction>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBankTransaction>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a bank transaction
 */
export declare const getUpdateBankTransactionUrl: (id: number) => string;
export declare const updateBankTransaction: (id: number, createBankTransactionBody: CreateBankTransactionBody, options?: RequestInit) => Promise<BankTransaction>;
export declare const getUpdateBankTransactionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBankTransaction>>, TError, {
        id: number;
        data: BodyType<CreateBankTransactionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateBankTransaction>>, TError, {
    id: number;
    data: BodyType<CreateBankTransactionBody>;
}, TContext>;
export type UpdateBankTransactionMutationResult = NonNullable<Awaited<ReturnType<typeof updateBankTransaction>>>;
export type UpdateBankTransactionMutationBody = BodyType<CreateBankTransactionBody>;
export type UpdateBankTransactionMutationError = ErrorType<unknown>;
/**
 * @summary Update a bank transaction
 */
export declare const useUpdateBankTransaction: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBankTransaction>>, TError, {
        id: number;
        data: BodyType<CreateBankTransactionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateBankTransaction>>, TError, {
    id: number;
    data: BodyType<CreateBankTransactionBody>;
}, TContext>;
/**
 * @summary Profit and Loss report
 */
export declare const getGetProfitLossReportUrl: (params?: GetProfitLossReportParams) => string;
export declare const getProfitLossReport: (params?: GetProfitLossReportParams, options?: RequestInit) => Promise<ProfitLossReport>;
export declare const getGetProfitLossReportQueryKey: (params?: GetProfitLossReportParams) => readonly ["/api/reports/profit-loss", ...GetProfitLossReportParams[]];
export declare const getGetProfitLossReportQueryOptions: <TData = Awaited<ReturnType<typeof getProfitLossReport>>, TError = ErrorType<unknown>>(params?: GetProfitLossReportParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProfitLossReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProfitLossReport>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProfitLossReportQueryResult = NonNullable<Awaited<ReturnType<typeof getProfitLossReport>>>;
export type GetProfitLossReportQueryError = ErrorType<unknown>;
/**
 * @summary Profit and Loss report
 */
export declare function useGetProfitLossReport<TData = Awaited<ReturnType<typeof getProfitLossReport>>, TError = ErrorType<unknown>>(params?: GetProfitLossReportParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProfitLossReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Balance Sheet report
 */
export declare const getGetBalanceSheetReportUrl: (params?: GetBalanceSheetReportParams) => string;
export declare const getBalanceSheetReport: (params?: GetBalanceSheetReportParams, options?: RequestInit) => Promise<BalanceSheetReport>;
export declare const getGetBalanceSheetReportQueryKey: (params?: GetBalanceSheetReportParams) => readonly ["/api/reports/balance-sheet", ...GetBalanceSheetReportParams[]];
export declare const getGetBalanceSheetReportQueryOptions: <TData = Awaited<ReturnType<typeof getBalanceSheetReport>>, TError = ErrorType<unknown>>(params?: GetBalanceSheetReportParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBalanceSheetReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBalanceSheetReport>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBalanceSheetReportQueryResult = NonNullable<Awaited<ReturnType<typeof getBalanceSheetReport>>>;
export type GetBalanceSheetReportQueryError = ErrorType<unknown>;
/**
 * @summary Balance Sheet report
 */
export declare function useGetBalanceSheetReport<TData = Awaited<ReturnType<typeof getBalanceSheetReport>>, TError = ErrorType<unknown>>(params?: GetBalanceSheetReportParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBalanceSheetReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Trial Balance report
 */
export declare const getGetTrialBalanceReportUrl: (params?: GetTrialBalanceReportParams) => string;
export declare const getTrialBalanceReport: (params?: GetTrialBalanceReportParams, options?: RequestInit) => Promise<TrialBalanceReport>;
export declare const getGetTrialBalanceReportQueryKey: (params?: GetTrialBalanceReportParams) => readonly ["/api/reports/trial-balance", ...GetTrialBalanceReportParams[]];
export declare const getGetTrialBalanceReportQueryOptions: <TData = Awaited<ReturnType<typeof getTrialBalanceReport>>, TError = ErrorType<unknown>>(params?: GetTrialBalanceReportParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTrialBalanceReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTrialBalanceReport>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTrialBalanceReportQueryResult = NonNullable<Awaited<ReturnType<typeof getTrialBalanceReport>>>;
export type GetTrialBalanceReportQueryError = ErrorType<unknown>;
/**
 * @summary Trial Balance report
 */
export declare function useGetTrialBalanceReport<TData = Awaited<ReturnType<typeof getTrialBalanceReport>>, TError = ErrorType<unknown>>(params?: GetTrialBalanceReportParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTrialBalanceReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Cash Flow Statement (indirect method)
 */
export declare const getGetCashFlowStatementUrl: (params?: GetCashFlowStatementParams) => string;
export declare const getCashFlowStatement: (params?: GetCashFlowStatementParams, options?: RequestInit) => Promise<CashFlowStatement>;
export declare const getGetCashFlowStatementQueryKey: (params?: GetCashFlowStatementParams) => readonly ["/api/reports/cash-flow-statement", ...GetCashFlowStatementParams[]];
export declare const getGetCashFlowStatementQueryOptions: <TData = Awaited<ReturnType<typeof getCashFlowStatement>>, TError = ErrorType<unknown>>(params?: GetCashFlowStatementParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCashFlowStatement>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCashFlowStatement>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCashFlowStatementQueryResult = NonNullable<Awaited<ReturnType<typeof getCashFlowStatement>>>;
export type GetCashFlowStatementQueryError = ErrorType<unknown>;
/**
 * @summary Cash Flow Statement (indirect method)
 */
export declare function useGetCashFlowStatement<TData = Awaited<ReturnType<typeof getCashFlowStatement>>, TError = ErrorType<unknown>>(params?: GetCashFlowStatementParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCashFlowStatement>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary General Ledger
 */
export declare const getGetGeneralLedgerReportUrl: (params?: GetGeneralLedgerReportParams) => string;
export declare const getGeneralLedgerReport: (params?: GetGeneralLedgerReportParams, options?: RequestInit) => Promise<GeneralLedgerAccount[]>;
export declare const getGetGeneralLedgerReportQueryKey: (params?: GetGeneralLedgerReportParams) => readonly ["/api/reports/general-ledger", ...GetGeneralLedgerReportParams[]];
export declare const getGetGeneralLedgerReportQueryOptions: <TData = Awaited<ReturnType<typeof getGeneralLedgerReport>>, TError = ErrorType<unknown>>(params?: GetGeneralLedgerReportParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGeneralLedgerReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGeneralLedgerReport>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGeneralLedgerReportQueryResult = NonNullable<Awaited<ReturnType<typeof getGeneralLedgerReport>>>;
export type GetGeneralLedgerReportQueryError = ErrorType<unknown>;
/**
 * @summary General Ledger
 */
export declare function useGetGeneralLedgerReport<TData = Awaited<ReturnType<typeof getGeneralLedgerReport>>, TError = ErrorType<unknown>>(params?: GetGeneralLedgerReportParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGeneralLedgerReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Drill into journal lines for an account in a period
 */
export declare const getGetDrillAccountUrl: (params: GetDrillAccountParams) => string;
export declare const getDrillAccount: (params: GetDrillAccountParams, options?: RequestInit) => Promise<DrillAccountResponse>;
export declare const getGetDrillAccountQueryKey: (params?: GetDrillAccountParams) => readonly ["/api/reports/drill/account", ...GetDrillAccountParams[]];
export declare const getGetDrillAccountQueryOptions: <TData = Awaited<ReturnType<typeof getDrillAccount>>, TError = ErrorType<unknown>>(params: GetDrillAccountParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDrillAccount>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDrillAccount>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDrillAccountQueryResult = NonNullable<Awaited<ReturnType<typeof getDrillAccount>>>;
export type GetDrillAccountQueryError = ErrorType<unknown>;
/**
 * @summary Drill into journal lines for an account in a period
 */
export declare function useGetDrillAccount<TData = Awaited<ReturnType<typeof getDrillAccount>>, TError = ErrorType<unknown>>(params: GetDrillAccountParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDrillAccount>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Resolve a sourceType+sourceId to its document and journal entries
 */
export declare const getGetDrillSourceUrl: (params: GetDrillSourceParams) => string;
export declare const getDrillSource: (params: GetDrillSourceParams, options?: RequestInit) => Promise<DrillSourceResponse>;
export declare const getGetDrillSourceQueryKey: (params?: GetDrillSourceParams) => readonly ["/api/reports/drill/source", ...GetDrillSourceParams[]];
export declare const getGetDrillSourceQueryOptions: <TData = Awaited<ReturnType<typeof getDrillSource>>, TError = ErrorType<unknown>>(params: GetDrillSourceParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDrillSource>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDrillSource>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDrillSourceQueryResult = NonNullable<Awaited<ReturnType<typeof getDrillSource>>>;
export type GetDrillSourceQueryError = ErrorType<unknown>;
/**
 * @summary Resolve a sourceType+sourceId to its document and journal entries
 */
export declare function useGetDrillSource<TData = Awaited<ReturnType<typeof getDrillSource>>, TError = ErrorType<unknown>>(params: GetDrillSourceParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDrillSource>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map