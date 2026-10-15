---
id: entity.grant-application
type: entity
title: Grant Application
summary: A request for grant funding, with the information and attachments an applicant submits.
status: draft
scope: domain
domain: grants-management
relationships:
  - type: references
    target: entity.document
    note: An application refers to the documents submitted with it.
attributes:
  - name: Application identifier
    description: A unique, permanent reference for the application.
  - name: Funding opportunity
    description: The program or opportunity the application responds to.
  - name: Applicant
    description: The organization or person requesting funding.
  - name: Contact
    description: The person to contact about the application.
  - name: Project title
    description: A short name for the proposed project.
  - name: Project summary
    description: A plain statement of what the project would do.
  - name: Amount requested
    description: The total funding requested, and its currency.
  - name: Project period
    description: The proposed start and end dates of the project.
  - name: Budget
    description: How the requested funding would be spent, by category.
  - name: Submitted
    description: The date and time the application was submitted.
  - name: Status
    description: The application's current status.
  - name: Certifications
    description: The statements the applicant affirmed when submitting.
  - name: Attachments
    description: Documents submitted with the application.
---

## Definition

A grant application is a request for funding from a specific program or opportunity. It holds who is applying, what they propose to do, how much they're asking for, and the documents they submit with it.

## Key attributes

{% include block-attributes.html %}

## Boundaries

A grant application holds information about one request for funding. It doesn't describe how applications are screened, reviewed, or decided. Those belong to processes such as {% include ref.html id="process.grant-application-review" %}, and keeping each application's status up to date belongs to {% include ref.html id="capability.application-management" %}.

An application also isn't an award. If funding is approved, the award is a separate record with its own terms, amounts, and dates. The attachments are documents in their own right, {% include ref.html id="entity.document" %}.

## Considerations

- Store the applicant as a reference to an organization or person, not as copied details, so the same applicant is recognized across applications.
- Keep the submitted version unchanged. If an applicant revises the application, record the revision separately.

## Related standards

- In the United States, the SF-424 family of forms defines common data for federal grant applications, such as the applicant, the project, and the funding requested.
