import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ContactEmailTemplateProps {
  name?: string;
  email?: string;
  inquery?: string;
}

export const ContactEmailTemplate = ({
  name = "John Doe",
  email = "johndoe@example.com",
  inquery = "I would like to know more about your services and pricing details.",
}: ContactEmailTemplateProps) => {
  const previewText = `New inquiry received from ${name}`;

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="mx-auto my-auto bg-[#f6f9fc] font-sans text-[#333333] px-2 py-6">
          <Container className="mx-auto my-[30px] max-w-[560px] rounded-xl border border-solid border-[#e5e7eb] bg-white p-[32px] shadow-sm">
            {/* Header / Badge */}
            <Section className="mb-[24px]">
              <div className="inline-block rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0284c7]">
                New Inquiry
              </div>
              <Heading className="mx-0 mt-3 mb-1 text-[24px] font-bold tracking-tight text-[#111827]">
                Contact Form Submission
              </Heading>
              <Text className="m-0 text-[14px] text-[#6b7280]">
                You have received a new message from your website contact form.
              </Text>
            </Section>

            <Hr className="my-[20px] border-t border-[#e5e7eb]" />

            {/* Sender Info Card */}
            <Section className="mb-[24px]">
              <div className="rounded-lg border border-[#f3f4f6] bg-[#f9fafb] p-4">
                <Text className="m-0 text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                  Sender Details
                </Text>

                <Text className="mt-2 mb-1 text-[15px] font-semibold text-[#1f2937]">
                  {name}
                </Text>

                <Text className="m-0 text-[14px] text-[#4b5563]">
                  <Link
                    href={`mailto:${email}`}
                    className="text-[#2563eb] underline font-medium"
                  >
                    {email}
                  </Link>
                </Text>
              </div>
            </Section>

            {/* Inquiry Content Box */}
            <Section className="mb-[28px]">
              <Text className="mb-2 text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                Message / Inquiry
              </Text>
              <div className="rounded-lg border border-[#e5e7eb] bg-[#ffffff] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <Text className="m-0 whitespace-pre-wrap text-[15px] leading-[24px] text-[#374151]">
                  {inquery}
                </Text>
              </div>
            </Section>

            {/* Quick Action Reply Button */}
            <Section className="mb-[28px] text-center">
              <Button
                className="box-border inline-block rounded-lg bg-[#111827] px-6 py-3 text-center text-[14px] font-medium text-white no-underline hover:bg-[#1f2937]"
                href={`mailto:${email}?subject=Re: Inquiry from ${encodeURIComponent(name)}`}
              >
                Reply to {name}
              </Button>
            </Section>

            <Hr className="my-[24px] border-t border-[#e5e7eb]" />

            {/* Footer */}
            <Section>
              <Text className="m-0 text-center text-xs leading-[20px] text-[#9ca3af]">
                This email was automatically generated from your contact form.
                <br />
                To respond directly, click the button above or reply to{" "}
                <Link
                  href={`mailto:${email}`}
                  className="text-[#6b7280] underline"
                >
                  {email}
                </Link>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ContactEmailTemplate.PreviewProps = {
  name: "Tanvir Ahmed",
  email: "tanvir@example.com",
  inquery:
    "Hello! I am interested in collaborating on an upcoming project. Could you share your portfolio and pricing rates?",
} as ContactEmailTemplateProps;

export default ContactEmailTemplate;
