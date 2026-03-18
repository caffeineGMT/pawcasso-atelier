declare module '@mailchimp/mailchimp_marketing' {
  interface Config {
    apiKey?: string;
    accessToken?: string;
    server?: string;
  }

  interface MailchimpClient {
    setConfig(config: Config): void;
    lists: {
      addListMember(
        listId: string,
        body: {
          email_address: string;
          status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending';
          tags?: string[];
          merge_fields?: Record<string, any>;
        }
      ): Promise<any>;
    };
  }

  const mailchimp: MailchimpClient;
  export default mailchimp;
}
